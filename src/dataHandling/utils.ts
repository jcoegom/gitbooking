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
        if (!resultDataByHost[host]) {
          resultDataByHost[host] = { appsSorted: [], apps: [] };
        } else {
          //Ya hay applicaciones ordenadas en el host
          let sortedLenght = resultDataByHost[host].appsSorted.length;
          if (
            sortedLenght === numSortedRegToReturn &&
            resultDataByHost[host].appsSorted[sortedLenght - 1].apdex >
              dataAppItem.apdex
          ) {
            resultDataByHost[host].apps.push(dataAppItem);
            continue;
          } else if (
            resultDataByHost[host].appsSorted.length === numSortedRegToReturn &&
            resultDataByHost[host].appsSorted[sortedLenght - 1].apdex <
              dataAppItem.apdex
          ) {
            let indexToInsert = this.getIndexToInsert(
              resultDataByHost[host].appsSorted,
              dataAppItem,
              "apdex"
            );
            resultDataByHost[host].appsSorted = this.insertDataInIndex(
              resultDataByHost[host].appsSorted,
              dataAppItem,
              indexToInsert
            ) as AppsType[];
            let dataPop = resultDataByHost[host].appsSorted.pop();
            if (dataPop) resultDataByHost[host].apps.push(dataPop);
          } else {
            let indexToInsert = this.getIndexToInsert(
              resultDataByHost[host].appsSorted,
              dataAppItem,
              "apdex"
            );
            resultDataByHost[host].appsSorted = this.insertDataInIndex(
              resultDataByHost[host].appsSorted,
              dataAppItem,
              indexToInsert
            ) as AppsType[];
          }
        }
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

  protected insertAppHostSorted(dataByHost: ByHostDataType, hostname: string) {
    return;
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
}

/* const myObj = new AppsByHost("hello", 5);
 myObj.myFunction(); */

/* const getTopAppsByHost = (dataByApp: ByAppDataType[], hostname: string) => {
  let dataByHost: ByHostDataType = { host: hostname, apps: [] };

 for (let dataByAppItem of dataByApp) {
    //Check if data includes hostname
    if (dataByAppItem.host.includes(hostname)) {
      //sort by apdex
      if (dataByHost.apps?.length === 0) {
        dataByHost.apps = [dataByAppItem];
        continue; //Next Loop cycle
      } else {
        let hostAppSize = dataByHost.apps.length;
        let { host, ...restDataByApp } = dataByAppItem; //TODO: Inside IF
        if (dataByAppItem.apdex >= dataByHost.apps[0].apdex) {
          dataByHost.apps = [...dataByHost.apps, restDataByApp];
        } else if (dataByAppItem.apdex <= dataByHost.apps[0].apdex) {
        }
      }
    }
  }
}; */
