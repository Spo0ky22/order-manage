import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import { login } from '../../tools/api';
import useHandleResponse from '../../hooks/useMessage';
import { useAppDispatch, useAppSelector } from '../../tools/store';
import { setLogin, setUsername } from '../../tools/store/actions';


type FieldType = {
  username: string;
  password: string;
};


const Login: React.FC = () => {
  const navigate = useNavigate();
  // const [username, setUsername] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  const handleResponse = useHandleResponse();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log('Success:', values);
    login(values).then((res: any) => handleResponse(res, 'Login Success!', 'Login Failed!'))
      .then((data) => {
        console.log('loginResponse:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.id)
        localStorage.setItem('isLogin', 'true');
        setTimeout(() => navigate('/user'), 1000);
      }).catch(error => console.error("Error", error))
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleRegister = (): void => {
    navigate('/register');
  };
  useEffect(() => {
    const isLogin = localStorage.getItem('isLogin') === 'true';
    if (isLogin) {
      navigate('/restaurant');
    }
  }, [navigate]);

  return (
    <div className='login-layout'>
      <h2>Login</h2>
      <Form
        name="basic"
        layout='vertical'
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          valuePropName="checked"
          wrapperCol={{ offset: 0, span: 6 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={handleRegister} style={{ marginLeft: 8 }}>Register</Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default Login;
