import { Button, Form, Input, Modal, Popconfirm, Space, Table } from "antd";
import React, { FC, ReactNode, memo, useEffect, useState } from "react";
import useTableHeight from "../../hooks/useTableHeight";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../tools/store";
import { closeUserModal, getRestaurantList, getUserList, openUserModal, setUserRecord, setUserSearchValue } from "../../tools/store/actions";
import { deleteUser, editUser, register } from "../../tools/api";
import useHandleResponse from "../../hooks/useMessage";

interface IProps {
  children?: ReactNode
}

const UserIndex: FC<IProps> = () => {
  const [usernameValue, setUsernameValue] = useState<string>('')
  const [phoneValue, setPhoneValue] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState<boolean>(false)

  const { list, isModalOpen, type, userRecord, page, searchValue } = useAppSelector((state: any) => state.user)
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const tableHeight = useTableHeight(380)
  const handleResponse = useHandleResponse();

  const columns: ColumnsType<any> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Firstname',
      dataIndex: 'firstname',
      key: 'firstname',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Lastname',
      dataIndex: 'lastname',
      key: 'lastname',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size='small' onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          <Popconfirm title='Are you sure you want to delete this data?' onConfirm={() => handleDeleteClick(record.id as string)} okText='Confirm' cancelText='Cancel'>
            <Button type="primary" size='small' danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    // 组件渲染时请求全量数据
    const fetchUserData = async () => {
      setTableLoading(true);
      await dispatch(getUserList({}));
      setTableLoading(false);
    };

    fetchUserData();
  }, []);

  // 给form表单赋初值
  useEffect(() => {
    // 给form表单赋初始值
    if (userRecord && isModalOpen === true) {
      form.setFieldsValue({
        username: userRecord.username,
        password: userRecord.password,
        email: userRecord.email,
        firstname: userRecord.firstname,
        lastname: userRecord.lastname,
        phone: userRecord.phone,
      })
    }
  }, [userRecord, form])

  const handleEditClick = (record: any) => {
    dispatch(setUserRecord({ username: record.username, password: record.password, phone: record.phone, firstname: record.firstname, lastname: record.lastname, email: record.email }))
    dispatch(openUserModal({ type: 'edit' }))
    console.log('Edit', userRecord)
  }
  const handleDeleteClick = async (id: string) => {
    try {
      const res: any = await deleteUser(id)
      handleResponse(res, 'Delete Success!', 'Delete Failed!')
      // 如果删除的是当前页最后一条数据，则跳转到前一页
      const updatedDataList = list.filter((item: any) => item.id !== id)
      // 重新获取数据列表
      dispatch(
        getUserList({
          pageNum: page.pageNum ? (updatedDataList.length === 0 ? page.pageNum - 1 : page.pageNum) : 1,
          pageSize: 10,
          username: searchValue?.username,
        })
      )
    } catch (error) {
      console.error('用户删除失败:', error)
    }
  }


  const handleSearch = () => {
    dispatch(getUserList({ pageNum: 1, pageSize: 10, username: usernameValue, phone: phoneValue }))
    dispatch(setUserSearchValue({ username: usernameValue, phone: phoneValue }))
  }
  const handleReset = () => {
    setUsernameValue('')
    setPhoneValue('')
    dispatch(setUserSearchValue({}))
    dispatch(getRestaurantList({ pageNum: 1, pageSize: 10 }))
  }
  const handleCreate = () => {
    dispatch(setUserRecord({ username: '', password: '', phone: '' }))
    dispatch(openUserModal({ type: 'add' }))
    console.log('Add', isModalOpen)
  }
  const handleOk = async () => {
    try {
      setLoading(true)
      const { username, password, phone, email, lastname, firstname } = await form.validateFields()
      if (type === 'add') {
        const res: any = await register({ username, password, phone, email, lastname, firstname })
        handleResponse(res, 'Add Success!', 'Add Failed!')
      }
      else {
        const res: any = await editUser({ id: userRecord?.id, username, password, phone, email, lastname, firstname })
        handleResponse(res, 'Edit Success!', 'Edit Failed!')
      }
      setLoading(false)
      dispatch(
        getUserList({
          pageNum: type === 'add' ? 1 : page.pageNum ?? 1,
          pageSize: 10,
          username: searchValue?.username,
        })
      )
      dispatch(closeUserModal())
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }
  const handleCancel = () => { dispatch(closeUserModal()) }
  return (
    <div className="user">
      <div className="box-style searchbar">
        <div className="search-box">
          <div className="input-box flex-y-center">
            <span className="search-span">
              <label className="search-label">Username：</label>
              <Input
                value={usernameValue}
                onChange={(e) => {
                  setUsernameValue(e.currentTarget.value)
                }}
                style={{ width: 230 }}
                placeholder={'Please enter a username keyword'}
              />
            </span>
            <span className="search-span">
              <label className="search-label">Phone：</label>
              <Input
                value={phoneValue}
                onChange={(e) => {
                  setPhoneValue(e.currentTarget.value)
                }}
                style={{ width: 230 }}
                placeholder={'Please enter phone number'}
              />
            </span>
          </div>
          <div className="button-box">
            <Button style={{ marginRight: 10 }} onClick={handleReset}>
              Reset
            </Button>
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
        <div className="add-box">
          <Button type="primary" onClick={handleCreate}>
            Add
          </Button>
        </div>
      </div>
      <div className="box-style">
        <Table loading={tableLoading} columns={columns} dataSource={list} bordered scroll={{ y: tableHeight }} />
      </div>
      <Modal
        title={(type === 'add' ? 'Add' : "Edit") + " User"}
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          style={{ maxWidth: 1000, margin: '30px' }}
        >

          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password placeholder="input password" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="First name" name="firstname">
            <Input />
          </Form.Item>
          <Form.Item label="Last name" name="lastname">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default memo(UserIndex)