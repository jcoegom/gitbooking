import {
  ByAppDataType,
  ByHostDataType,
  GenericAppType,
  AppsType,
} from "./utils.d";

class AppsByHost {
  private dataByApp: ByAppDataType[];
  private dataByHostSorted: ByHostDataType;
  private numSortedRegToReturn = 25;

  constructor(
    _dataByApp: ByAppDataType[],
    _numSortedRegToReturn: number,
    { transformData = true }: { transformData: boolean }
  ) {
    this.numSortedRegToReturn = _numSortedRegToReturn;
    this.dataByApp = _dataByApp;
    this.dataByHostSorted = this.transformAppDataToHost(
      _dataByApp,
      _numSortedRegToReturn
    );
  }

  private transformAppDataToHost(
    dataByApp: ByAppDataType[],
    numSortedRegToReturn: number
  ): ByHostDataType {
    let resultDataByHost: ByHostDataType = {};
    for (let dataAppItem of dataByApp) {
      //recorre todas las app.
      for (let host of dataAppItem.host) {
        //Recorre los host de cada app
        resultDataByHost = this.insertAppHostSorted(
          resultDataByHost,
          dataAppItem,
          host,
          numSortedRegToReturn
        );
      }
    }

    return resultDataByHost;
  }

  protected getIndexToInsert(
    dataApp: GenericAppType[], //TODO: Esto hay que ponerlo en una variable aparte.
    dataAppToInsert: GenericAppType, //Si pongo tipos estaría acoplado.
    variableToSort: string = "apdex"
  ): number {
    //It is coupled, but it is normal, its target is thinking in this type of data.
    //Is protectect. A subclass may overwrite this method.
    //It implements Binary search.
    let left = 0;
    let right = dataApp.length - 1;
    let middle = Math.floor((left + right) / 2);

    while (left <= right) {
      if (dataApp[middle][variableToSort] === dataAppToInsert[variableToSort]) {
        return middle;
      } else if (
        dataApp[middle][variableToSort] > dataAppToInsert[variableToSort]
      ) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
      middle = Math.floor((left + right) / 2);
    }
    return left;
  }

  protected insertAppHostSorted(
    dataByHost: ByHostDataType,
    dataToInsert: AppsType,
    hostname: string,
    numSortedRegToReturn: number
  ): ByHostDataType {
    if (!dataByHost[hostname]) {
      dataByHost[hostname] = { appsSorted: [], apps: [] };
    } else {
      //Ya hay applicaciones ordenadas en el host
      let sortedLenght = dataByHost[hostname].appsSorted.length;
      if (
        sortedLenght === numSortedRegToReturn &&
        dataByHost[hostname].appsSorted[sortedLenght - 1].apdex >
          dataToInsert.apdex
      ) {
        dataByHost[hostname].apps.push(dataToInsert);
      } else if (
        dataByHost[hostname].appsSorted.length === numSortedRegToReturn &&
        dataByHost[hostname].appsSorted[sortedLenght - 1].apdex <
          dataToInsert.apdex
      ) {
        let indexToInsert = this.getIndexToInsert(
          dataByHost[hostname].appsSorted,
          dataToInsert,
          "apdex"
        );
        dataByHost[hostname].appsSorted = this.insertDataInIndex(
          dataByHost[hostname].appsSorted,
          dataToInsert,
          indexToInsert
        ) as AppsType[];
        let dataPop = dataByHost[hostname].appsSorted.pop();
        if (dataPop) dataByHost[hostname].apps.push(dataPop);
      } else {
        let indexToInsert = this.getIndexToInsert(
          dataByHost[hostname].appsSorted,
          dataToInsert,
          "apdex"
        );
        dataByHost[hostname].appsSorted = this.insertDataInIndex(
          dataByHost[hostname].appsSorted,
          dataToInsert,
          indexToInsert
        ) as AppsType[];
      }
    }
    return dataByHost;
  }

  private insertDataInIndex(
    dataApp: GenericAppType[],
    dataAppToInsert: GenericAppType,
    index: number
  ): GenericAppType[] {
    let { host, ...restDataByHost } = dataAppToInsert;
    dataApp.splice(index, 0, restDataByHost);
    return dataApp;
  }

  public getTopAppsByHost(hostname: string): AppsType[] {
    if (!this.dataByHostSorted[hostname]) return [];
    let result: AppsType[] = [...this.dataByHostSorted[hostname].appsSorted];
    return result;
  }

  public addAppToHosts(appToAdd: AppsType, hostname: string): AppsType[] {
    this.dataByHostSorted = this.insertAppHostSorted(
      this.dataByHostSorted,
      appToAdd,
      hostname,
      this.numSortedRegToReturn
    );
    return this.dataByHostSorted[hostname].appsSorted;
  }
  public removeAppFromHosts(appName: string, hostname: string) {
    let apps = [...this.dataByHostSorted[hostname].apps];
    let appsSorted = [...this.dataByHostSorted[hostname].apps];
    let indexToRemove = -1;
    let appMaxValue: AppsType | null = apps[0];
    for (let i = 0; i < apps.length; i++) {
      if (apps[i].name === appName) {
        indexToRemove = i;
      }
      if (apps[i].apdex > appMaxValue.apdex) {
        appMaxValue = { ...apps[i] };
      }
    }
    if (indexToRemove !== -1) {
      //element Found
      apps.splice(indexToRemove, 1);
      this.dataByHostSorted[hostname].apps = apps;
      return;
    }

    for (let i = 0; i < appsSorted.length; i++) {
      if (appsSorted[i].name === appName) {
        indexToRemove = i;
        break;
      }
    }
    if (indexToRemove !== -1) {
      appsSorted.splice(indexToRemove, 1);
      appsSorted.push(appMaxValue);
      this.dataByHostSorted[hostname].appsSorted = appsSorted;
    }
  }
}
