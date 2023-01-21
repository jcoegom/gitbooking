import {
  ByAppDataType,
  ByHostDataType,
  GenericAppType,
  AppsType,
} from "./dataHandler.d";

export class AppsByHost {
  private dataByHostSorted: ByHostDataType;
  private numSortedRegToReturn = 25;

  constructor(_dataByApp: ByAppDataType[], _numSortedRegToReturn: number) {
    this.numSortedRegToReturn = _numSortedRegToReturn;
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
      for (let hostname of dataAppItem.host) {
        //Recorre los host de cada app
        let { host, ...dataAppItemToInsert } = dataAppItem;
        resultDataByHost = this.insertAppHostSorted(
          resultDataByHost,
          dataAppItemToInsert,
          hostname,
          numSortedRegToReturn
        );
      }
    }

    return resultDataByHost;
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

  protected getIndexToInsert(
    dataApp: GenericAppType[],
    dataAppToInsert: GenericAppType, //Si pongo tipos estaría acoplado.
    variableToSort: string = "apdex"
  ): number {
    //Is protectect. A subclass may overwrite this method.
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
      dataByHost[hostname] = { appsSorted: [{ ...dataToInsert }], apps: [] };
    } else {
      let sortedLenght = dataByHost[hostname].appsSorted.length;
      if (
        sortedLenght === numSortedRegToReturn &&
        dataByHost[hostname].appsSorted[sortedLenght - 1].apdex >=
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
        if (dataByHost[hostname].appsSorted.length === numSortedRegToReturn) {
          console.log(
            "dataByHost.appssorted.lenght",
            dataByHost[hostname].appsSorted.length
          );
        }
        dataByHost[hostname].appsSorted = this.insertDataInIndex(
          dataByHost[hostname].appsSorted,
          dataToInsert,
          indexToInsert
        ) as AppsType[];
      }
    }
    return dataByHost;
  }

  public getAllDataSorted() {
    return this.dataByHostSorted;
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
    if (!this.dataByHostSorted[hostname]) return;
    let apps = [...this.dataByHostSorted[hostname].apps];
    let appsSorted = [...this.dataByHostSorted[hostname].appsSorted];
    let indexToRemove = -1;
    let appMaxValue: AppsType | null = apps[0];
    let indexMaxValue = 0;
    for (let i = 0; i < apps.length; i++) {
      if (apps[i].name === appName) {
        indexToRemove = i;
      }
      if (apps[i].apdex > appMaxValue.apdex) {
        appMaxValue = { ...apps[i] };
        indexMaxValue = i;
      }
    }

    if (indexToRemove !== -1) {
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
      apps.splice(indexMaxValue, 1);
      this.dataByHostSorted[hostname].apps = apps;
    }
  }
}
