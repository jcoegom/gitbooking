import { AppsByHost } from "./dataHandler";
import {
  ByAppDataType,
  ByHostDataType,
  GenericAppType,
  AppsType,
} from "./dataHandler.d";

describe("AppsByHost", () => {
  const appData: ByAppDataType[] = [
    {
      name: "App 1",
      contributors: ["John Doe"],
      version: 1,
      apdex: 80,
      host: ["host1"],
    },
    {
      name: "App 2",
      contributors: ["Jane Doe"],
      version: 2,
      apdex: 90,
      host: ["host2", "host1"],
    },
    {
      name: "App 3",
      contributors: ["John Doe", "Jane Doe"],
      version: 3,
      apdex: 70,
      host: ["host1", "host2"],
    },
  ];
  const numSortedRegToReturn = 2;
  let appByHost: AppsByHost;

  beforeEach(() => {
    appByHost = new AppsByHost(appData, numSortedRegToReturn);
  });

  it("should initialize dataByHostSorted correctly", () => {
    expect(appByHost.getAllDataSorted()).toEqual({
      host1: {
        appsSorted: [
          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
          {
            name: "App 1",
            contributors: ["John Doe"],
            version: 1,
            apdex: 80,
          },
        ],
        apps: [
          {
            name: "App 3",
            contributors: ["John Doe", "Jane Doe"],
            version: 3,
            apdex: 70,
          },
        ],
      },
      host2: {
        appsSorted: [
          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
          {
            name: "App 3",
            contributors: ["John Doe", "Jane Doe"],
            version: 3,
            apdex: 70,
          },
        ],
        apps: [],
      },
    });
  });

  it("should add data properly", () => {
    appByHost.addAppToHosts(
      { name: "appToAdd", apdex: 100, contributors: ["contAdded"], version: 4 },
      "host1"
    );
    expect(appByHost.getAllDataSorted()).toEqual({
      host1: {
        appsSorted: [
          {
            name: "appToAdd",
            contributors: ["contAdded"],
            version: 4,
            apdex: 100,
          },

          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
        ],
        apps: [
          {
            name: "App 3",
            contributors: ["John Doe", "Jane Doe"],
            version: 3,
            apdex: 70,
          },
          {
            name: "App 1",
            contributors: ["John Doe"],
            version: 1,
            apdex: 80,
          },
        ],
      },
      host2: {
        appsSorted: [
          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
          {
            name: "App 3",
            contributors: ["John Doe", "Jane Doe"],
            version: 3,
            apdex: 70,
          },
        ],
        apps: [],
      },
    });
  });

  it("should return data by host properly", () => {
    let dataTopN = appByHost.getTopAppsByHost("host1");
    expect(dataTopN).toEqual([
      {
        name: "App 2",
        contributors: ["Jane Doe"],
        version: 2,
        apdex: 90,
      },
      {
        name: "App 1",
        contributors: ["John Doe"],
        version: 1,
        apdex: 80,
      },
    ]);
  });

  it("should remove data by host (from apps array) properly", () => {
    appByHost.removeAppFromHosts("App 3", "host1");
    expect(appByHost.getAllDataSorted()).toEqual({
      host1: {
        appsSorted: [
          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
          {
            name: "App 1",
            contributors: ["John Doe"],
            version: 1,
            apdex: 80,
          },
        ],
        apps: [],
      },
      host2: {
        appsSorted: [
          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
          {
            name: "App 3",
            contributors: ["John Doe", "Jane Doe"],
            version: 3,
            apdex: 70,
          },
        ],
        apps: [],
      },
    });
  });

  it("should remove data by host (from appsSorted array) properly", () => {
    appByHost.removeAppFromHosts("App 1", "host1");
    expect(appByHost.getAllDataSorted()).toEqual({
      host1: {
        appsSorted: [
          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
          {
            name: "App 3",
            contributors: ["John Doe", "Jane Doe"],
            version: 3,
            apdex: 70,
          },
        ],
        apps: [],
      },
      host2: {
        appsSorted: [
          {
            name: "App 2",
            contributors: ["Jane Doe"],
            version: 2,
            apdex: 90,
          },
          {
            name: "App 3",
            contributors: ["John Doe", "Jane Doe"],
            version: 3,
            apdex: 70,
          },
        ],
        apps: [],
      },
    });
  });
});
