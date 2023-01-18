export type ByAppDataType = {
  name: string;
  contributors: string[];
  version: number;
  apdex: number;
  host: string[];
};

export type ByHostDataType = {
  host: string;
  appsSorted: Omit<ByAppDataType, "host">[];
  apps: AppsType[];
};

export type AppsType = Omit<ByAppDataType, "host">;
export type GenericAppType = { [key: string]: string | number | string[] };
