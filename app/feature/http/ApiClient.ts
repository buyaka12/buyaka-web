import axios from 'axios';
import type {AxiosRequestConfig} from 'axios';

export const BASE_URL = "http://217.42.232.71:5005/api";

export class ApiClient {
  private static async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios({
        ...config,
        baseURL: BASE_URL,
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async get<T>(url: string, config?: Omit<AxiosRequestConfig, 'method'>): Promise<T> {
    return this.makeRequest({...config, url, method: 'GET'});
  }

  static async post<T>(url: string, data?: object, config?: Omit<AxiosRequestConfig, 'method' | 'data'>): Promise<T> {
    return this.makeRequest({...config, url, method: 'POST', data});
  }

  static async put<T>(url: string, data?: object, config?: Omit<AxiosRequestConfig, 'method' | 'data'>): Promise<T> {
    return this.makeRequest({...config, url, method: 'PUT', data});
  }

  // Add other methods as needed (delete, patch, etc.)
}