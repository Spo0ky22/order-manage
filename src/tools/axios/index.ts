import axios, { AxiosResponse, AxiosError } from 'axios'

// 设置默认的 baseURL
// axios.defaults.baseURL = 'http://124.221.141.119:8080';

axios.defaults.baseURL = 'http://192.168.31.162:8080'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// 在请求发送前，为请求头添加 token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 封装 GET 请求
export function get<T>(url: string, params?: any): Promise<T> {
  return axios
    .get(url, { params })
    .then((response: AxiosResponse<T>) => response.data)
    .catch((error: AxiosError) => {
      console.error('GET Error:', error)
      throw error
    })
}

// 封装 POST 请求
export function post<T>(url: string, data: any): Promise<T> {
  return axios
    .post(url, data)
    .then((response: AxiosResponse<T>) => response.data)
    .catch((error: AxiosError) => {
      console.error('POST Error:', error)
      throw error
    })
}

// 封装 DELETE 请求
export function del<T>(url: string, id: string): Promise<T> {
  return axios
    .delete(`${url}/${id}`)
    .then((response: AxiosResponse<T>) => response.data)
    .catch((error: AxiosError) => {
      console.error('DELETE Error:', error)
      throw error
    })
}

// 封装 PUT 请求
export function put<T>(url: string, data: any): Promise<T> {
  return axios
    .put(url, data)
    .then((response: AxiosResponse<T>) => response.data)
    .catch((error: AxiosError) => {
      console.error('PUT Error:', error)
      throw error
    })
}
