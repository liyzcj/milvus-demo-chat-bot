import axios from "axios";
import React, { createContext, FC, ReactNode } from "react";
import * as URL from "../utils/Endpoints";

const axiosInstance = axios.create();

export const queryContext = createContext<any>({});
const Provider = queryContext.Provider;

const QueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const errorParser = (e: any) => {
    console.log(e);
  };

  const load = async (params: any) => {
    const url = URL.Load;
    return await axiosInstance.post(url, params).catch(errorParser);
  };

  const answer = async (question: any) => {
    const url = URL.Answer + '?question=' + question;;
    return await axiosInstance.get(url).catch(errorParser);
  };
  const search = async (question: string) => {
    const url = URL.Search + '?question=' + question;
    return await axiosInstance.get(url).catch(errorParser);
  };
  const clearAll = async () => {
    const url = URL.ClearAll;
    return await axiosInstance.post(url).catch(errorParser);
  };

  return (
    <Provider
      value={{
        load,
        answer,
        search,
        clearAll,
      }}
    >
      {children}
    </Provider>
  );
};

export default QueryProvider;
