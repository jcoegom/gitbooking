"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var dataIn = require("./data.json");
var AppsByHost = /** @class */ (function () {
    function AppsByHost(_dataByApp, _numSortedRegToReturn) {
        this.numSortedRegToReturn = 25;
        this.numSortedRegToReturn = _numSortedRegToReturn;
        this.dataByHostSorted = this.transformAppDataToHost(_dataByApp, _numSortedRegToReturn);
    }
    AppsByHost.prototype.transformAppDataToHost = function (dataByApp, numSortedRegToReturn) {
        var resultDataByHost = {};
        for (var _i = 0, dataByApp_1 = dataByApp; _i < dataByApp_1.length; _i++) {
            var dataAppItem = dataByApp_1[_i];
            //recorre todas las app.
            for (var _a = 0, _b = dataAppItem.host; _a < _b.length; _a++) {
                var hostname = _b[_a];
                //Recorre los host de cada app
                var host = dataAppItem.host, dataAppItemToInsert = __rest(dataAppItem, ["host"]);
                resultDataByHost = this.insertAppHostSorted(resultDataByHost, dataAppItemToInsert, hostname, numSortedRegToReturn);
            }
        }
        return resultDataByHost;
    };
    AppsByHost.prototype.getIndexToInsert = function (dataApp, //TODO: Esto hay que ponerlo en una variable aparte.
    dataAppToInsert, //Si pongo tipos estaría acoplado.
    variableToSort) {
        if (variableToSort === void 0) { variableToSort = "apdex"; }
        //It is coupled, but it is normal, its target is thinking in this type of data.
        //Is protectect. A subclass may overwrite this method.
        //It implements Binary search.
        var left = 0;
        var right = dataApp.length - 1;
        var middle = Math.floor((left + right) / 2);
        while (left <= right) {
            if (dataApp[middle][variableToSort] === dataAppToInsert[variableToSort]) {
                return middle;
            }
            else if (dataApp[middle][variableToSort] > dataAppToInsert[variableToSort]) {
                left = middle + 1;
            }
            else {
                right = middle - 1;
            }
            middle = Math.floor((left + right) / 2);
        }
        return left;
    };
    AppsByHost.prototype.insertAppHostSorted = function (dataByHost, dataToInsert, hostname, numSortedRegToReturn) {
        if (!dataByHost[hostname]) {
            dataByHost[hostname] = { appsSorted: [__assign({}, dataToInsert)], apps: [] };
        }
        else {
            //Ya hay applicaciones ordenadas en el host
            var sortedLenght = dataByHost[hostname].appsSorted.length;
            if (sortedLenght === numSortedRegToReturn &&
                dataByHost[hostname].appsSorted[sortedLenght - 1].apdex >
                    dataToInsert.apdex) {
                dataByHost[hostname].apps.push(dataToInsert);
            }
            else if (dataByHost[hostname].appsSorted.length === numSortedRegToReturn &&
                dataByHost[hostname].appsSorted[sortedLenght - 1].apdex <
                    dataToInsert.apdex) {
                var indexToInsert = this.getIndexToInsert(dataByHost[hostname].appsSorted, dataToInsert, "apdex");
                dataByHost[hostname].appsSorted = this.insertDataInIndex(dataByHost[hostname].appsSorted, dataToInsert, indexToInsert);
                var dataPop = dataByHost[hostname].appsSorted.pop();
                if (dataPop)
                    dataByHost[hostname].apps.push(dataPop);
            }
            else {
                var indexToInsert = this.getIndexToInsert(dataByHost[hostname].appsSorted, dataToInsert, "apdex");
                dataByHost[hostname].appsSorted = this.insertDataInIndex(dataByHost[hostname].appsSorted, dataToInsert, indexToInsert);
            }
        }
        return dataByHost;
    };
    AppsByHost.prototype.insertDataInIndex = function (dataApp, dataAppToInsert, index) {
        var host = dataAppToInsert.host, restDataByHost = __rest(dataAppToInsert, ["host"]);
        dataApp.splice(index, 0, restDataByHost);
        return dataApp;
    };
    AppsByHost.prototype.getTopAppsByHost = function (hostname) {
        if (!this.dataByHostSorted[hostname])
            return [];
        var result = __spreadArray([], this.dataByHostSorted[hostname].appsSorted, true);
        return result;
    };
    AppsByHost.prototype.addAppToHosts = function (appToAdd, hostname) {
        this.dataByHostSorted = this.insertAppHostSorted(this.dataByHostSorted, appToAdd, hostname, this.numSortedRegToReturn);
        return this.dataByHostSorted[hostname].appsSorted;
    };
    AppsByHost.prototype.removeAppFromHosts = function (appName, hostname) {
        if (!this.dataByHostSorted[hostname])
            return;
        var apps = __spreadArray([], this.dataByHostSorted[hostname].apps, true);
        var appsSorted = __spreadArray([], this.dataByHostSorted[hostname].appsSorted, true);
        var indexToRemove = -1;
        var appMaxValue = apps[0];
        var indexMaxValue = 0;
        for (var i = 0; i < apps.length; i++) {
            if (apps[i].name === appName) {
                indexToRemove = i;
            }
            if (apps[i].apdex > appMaxValue.apdex) {
                appMaxValue = __assign({}, apps[i]);
                indexMaxValue = i;
            }
        }
        if (indexToRemove !== -1) {
            //element Found
            apps.splice(indexToRemove, 1);
            this.dataByHostSorted[hostname].apps = apps;
            return;
        }
        for (var i = 0; i < appsSorted.length; i++) {
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
    };
    return AppsByHost;
}());
var showData = function (data, print) {
    if (print === void 0) { print = true; }
    if (!print)
        return;
    console.log(JSON.stringify(data));
};
var appByHost = new AppsByHost(dataIn.data, 2);
showData(appByHost.dataByHostSorted.host1);
appByHost.removeAppFromHosts("app2", "host1");
showData(appByHost.dataByHostSorted.host1);
appByHost.removeAppFromHosts("app4", "host1");
showData(appByHost.dataByHostSorted.host1);
/* showData(appByHost.getTopAppsByHost("host1"));
appByHost.addAppToHosts(
  {
    name: "app6",
    apdex: 99,
  },
  "host1"
);
showData(appByHost.getTopAppsByHost("host1"));
showData(appByHost.dataByHostSorted.host1);
appByHost.removeAppFromHosts("app6", "host1");
showData(appByHost.dataByHostSorted.host1);
 */
