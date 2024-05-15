import { message } from 'antd';
import { useCallback } from 'react';

interface ResponseType {
  msg?: string;
  data?: any;
  code?: number;
  status?: number;
}

const useHandleResponse = () => {
  const handleResponse = useCallback((response: ResponseType, successMessage: string, errorMessage: string) => {
    if (response.code === 200 || response.status === 200) {
      message.success(successMessage);
      return response.data;
    } else {
      message.error(errorMessage);
      throw response.msg;
    }
  }, []);

  return handleResponse;
};

export default useHandleResponse;