import axios from "axios";
import { useEffect, useState } from "react";
import { AppsByHost } from "../../../utils/dataHandler";
import { ByHostDataType } from "../../../utils/dataHandler.d";
import { handleError } from "../../../utils/errors";

const useGetData = (url: string): [boolean, unknown, ByHostDataType | null] => {
  const [queryState, setQueryState] = useState<{
    //TODO: UseReducer
    load: boolean;
    error: unknown | null;
    result: ByHostDataType | null;
  }>({ load: false, error: null, result: null });

  useEffect(() => {
    setQueryState({ load: true, error: null, result: null });

    axios
      .get(url)
      .then((result) => {
        if (!result?.data?.data) return;
        let appsByHost = new AppsByHost(result.data.data, 5);
        setQueryState({
          load: false,
          error: null,
          result: appsByHost.getAllDataSorted(),
        });
      })
      .catch((err) => {
        setQueryState({ load: false, error: err, result: null });
        handleError(err);
      })
      .finally(() => {
        setQueryState((prevQueryState) => ({ ...prevQueryState, load: false }));
      });
    //TODO: Abort query
  }, []);

  return [queryState.load, queryState.error, queryState.result];
};

export default useGetData;
