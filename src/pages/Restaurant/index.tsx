import { Button, Form, Input, Modal, Popconfirm, Space, Table } from "antd";
import React, { FC, ReactNode, memo, useEffect, useState } from "react";
import useTableHeight from "../../hooks/useTableHeight";
import { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import { useAppDispatch, useAppSelector } from "../../tools/store";
import { closeRestaurantModal, getRestaurantList, openRestaurantModal, setRestaurantRecord, setSearchValue } from "../../tools/store/actions";
import { addRestaurant, deleteRestaurant, editRestaurant } from "../../tools/api";
import useHandleResponse from "../../hooks/useMessage";
import UserSelector from "../../components/UserSelector";

interface IProps {
  children?: ReactNode
}

const RestaurantIndex: FC<IProps> = () => {
  const [loading, setLoading] = useState(false);
  const [nameValue, setNameValue] = useState<string>('')
  const [userId, setUserId] = useState<number | undefined>()
  const [form] = Form.useForm()
  const handleResponse = useHandleResponse();

  // 使用自定义hook
  const tableHeight = useTableHeight(380)

  // 使用Redux
  const { list, isModalOpen, type, restaurantRecord, page, searchValue, tableLoading } = useAppSelector((state: any) => state.restaurant)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // 组件渲染时请求全量数据
    dispatch(getRestaurantList({}))
    console.log('restaurantList:', list)
  }, []);

  // 给form表单赋初值
  useEffect(() => {
    // 给form表单赋初始值
    if (restaurantRecord && isModalOpen === true) {
      form.setFieldsValue({
        name: restaurantRecord.name,
        address: restaurantRecord.address,
        phone: restaurantRecord.phone,
      })
      setUserId(restaurantRecord.userId)
    }
  }, [restaurantRecord, form])

  // 列名
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (_, __, rowIndex) => rowIndex + 1,
    },
    {
      title: 'Restaurant Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
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

  const handleEditClick = (record: any) => {
    dispatch(setRestaurantRecord({ id: record.id, userId: record.userId, name: record.name, address: record.address, phone: record.phone }))
    dispatch(openRestaurantModal({ type: 'edit' }))
  }

  const handleDeleteClick = async (id: string) => {
    try {
      const res: any = await deleteRestaurant(id)
      handleResponse(res, 'Delete Success!', 'Delete Failed!')
      // 如果删除的是当前页最后一条数据，则跳转到前一页
      const updatedDataList = list.filter((item: any) => item.id !== id)
      // 重新获取数据列表
      dispatch(
        getRestaurantList({
          pageNum: page.pageNum ? (updatedDataList.length === 0 ? page.pageNum - 1 : page.pageNum) : 1,
          pageSize: 10,
          name: searchValue?.name,
        })
      )
    } catch (error) {
      console.error('数据删除失败:', error)
    }
  }

  const handleReset = () => {
    setNameValue('')
    dispatch(setSearchValue(''))
    dispatch(getRestaurantList({ pageNum: 1, pageSize: 10 }))
  }
  const handleCreate = () => {
    dispatch(setRestaurantRecord({ userId: undefined, name: '', address: '', phone: '' }))
    dispatch(openRestaurantModal({ type: 'add' }))
  }
  const handleSearch = () => {
    dispatch(getRestaurantList({ pageNum: 1, pageSize: 10, name: nameValue }))
    dispatch(setSearchValue(nameValue))
  }
  const handleOk = async () => {
    try {
      setLoading(true)
      const { name, address, phone } = await form.validateFields()
      if (type === 'add') {
        const res: any = await addRestaurant({ userId: userId, name, address, phone })
        handleResponse(res, 'Add Success!', 'Add Failed!')
      }
      else {
        const res: any = await editRestaurant({ id: restaurantRecord?.id, userId: userId, name, address, phone })
        handleResponse(res, 'Edit Success!', 'Edit Failed!')
      }
      setLoading(false)
      dispatch(
        getRestaurantList({
          pageNum: type === 'add' ? 1 : page.pageNum ?? 1,
          pageSize: 10,
          name: searchValue?.name,
        })
      )
      dispatch(closeRestaurantModal())
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }
  const handleCancel = () => {
    dispatch(closeRestaurantModal())
  }

  const handleSelectChange = (value: number) => {
    setUserId(value)
  }

  return (
    <div className="restaurant">
      <div className="box-style searchbar">
        <div className="search-box">
          <div className="input-box flex-y-center">
            <span className="search-span">
              <label className="search-label">Restaurant name：</label>
              <Input
                value={nameValue}
                onChange={(e) => {
                  setNameValue(e.currentTarget.value)
                }}
                style={{ width: 230 }}
                placeholder={'Please enter a name keyword'}
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
        title={(type === 'add' ? 'Add' : "Edit") + " Restaurant"}
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
          <Form.Item label="User" name="userId">
            <UserSelector selectedValues={userId} onSelectChange={handleSelectChange} />
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <TextArea
              placeholder="Please enter Address"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default memo(RestaurantIndex)