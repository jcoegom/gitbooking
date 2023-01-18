import {
  ByAppDataType,
  ByHostDataType,
  GenericAppType,
  AppsType,
} from "./utils.d";

class AppsByHost {
  private dataByApp: ByAppDataType[];
  private dataByHost: ByHostDataType[];
  private NUM_SORTED_REG_TO_RETURN = 25;

  constructor(
    _dataByApp: ByAppDataType[],
    { transformData = true }: { transformData: boolean }
  ) {
    this.dataByApp = _dataByApp;
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

  private insertDataInIndex(
    dataApp: GenericAppType[],
    dataAppToInsert: GenericAppType,
    index: number
  ): GenericAppType[] {
    let { host, ...restDataByHost } = dataAppToInsert;
    dataApp.splice(index, 0, restDataByHost);
    return dataApp;
  }

  public getTopAppsByHost(hostname: string): ByHostDataType {
    let dataByHostTop25: ByHostDataType = {
      host: hostname,
      appsSorted: [],
      apps: [],
    };
    for (let dataByAppItem of this.dataByApp) {
      //check if app contains host passed as param
      if (dataByAppItem.host.includes(hostname)) {
        //If I have NUM_SORTED_REG_TO_RETURN then first check if new value is higher than mininum.
        if (
          dataByHostTop25.apps.length >= 25 &&
          dataByHostTop25.apps[this.NUM_SORTED_REG_TO_RETURN - 1].apdex >
            dataByAppItem.apdex
        ) {
          let { host, ...restDataByHost } = dataByAppItem;
          dataByHostTop25.apps.push(restDataByHost);
          continue;
        }
        //insert app sorted by apdex
        let indexToInsert = this.getIndexToInsert(
          dataByHostTop25.apps,
          dataByAppItem,
          "apdex"
        );

        dataByHostTop25.appsSorted = this.insertDataInIndex(
          dataByHostTop25.appsSorted,
          dataByAppItem,
          indexToInsert
        ) as AppsType[];
      }
    }

    return dataByHostTop25;
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
