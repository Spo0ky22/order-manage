import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, type FormProps, Input } from 'antd';
import { login, register } from '../../tools/api/index'
import useHandleResponse from '../../hooks/useMessage';

type FieldType = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  // const [username, setUsername] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  const handleResponse = useHandleResponse();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log('Success:', values);
    register(values).then((res: any) => handleResponse(res, 'Register Success!', 'Register Failed!'))
      .then(() => {
        setTimeout(() => navigate('/login'), 1000)
      }).catch(error => console.error("Error", error))
  };

  const handleLogin = (): void => {
    navigate('/login');
  };

  return (
    <div className='register-layout'>
      <h2>Sign Up</h2>
      <Form
        name="basic"
        layout='vertical'
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 16 }}

        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
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
          label="First Name"
          name="firstname"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Last Name"
          name="lastname"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please input your Phone!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your last Email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={handleLogin} style={{ marginLeft: 8 }}>Login</Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default memo(Register);
