export type ByAppDataType = {
  name: string;
  contributors: string[];
  version: number;
  apdex: number;
  host: string[];
};

export type ByHostDataType = {
  [key: string]: { appsSorted: AppsType[]; apps: AppsType[] };
};

export type AppsType = Omit<ByAppDataType, "host">;
export type GenericAppType = { [key: string]: string | number | string[] };
