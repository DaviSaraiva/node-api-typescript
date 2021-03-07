/* eslint-disable @typescript-eslint/no-empty-interface */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestConfig extends AxiosRequestConfig { }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Response<T = any> extends AxiosResponse<T> { }

export class Request {
    constructor(private request = axios) { }

    //maneira generica de saber o tipo da resposta
    public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
        return this.request.get<T, Response<T>>(url, config);
    }
    public static isRequestError(error: AxiosError): boolean {
        return !!(error.response && error.response.status);
    }
}



// generics sendo capaz de criar um componente que pode funcionar em vários tipos, em vez de em um único