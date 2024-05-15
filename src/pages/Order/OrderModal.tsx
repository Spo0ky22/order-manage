import { Input, InputNumber, Modal, Switch } from 'antd'
import React, { FC, useRef, ReactNode, memo, useState, useEffect, useMemo } from 'react'
import useHandleResponse from '../../hooks/useMessage'
import { useAppDispatch, useAppSelector } from '../../tools/store'
import RestaurantSelector from '../../components/RestaurantSelector'
import type { EditableFormInstance, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { EditableProTable, ProForm } from '@ant-design/pro-components'
import { closeDishModal, getDishList } from '../../tools/store/actions'
import { addOrder } from '../../tools/api'
import { DishData } from '../../tools/store/reducers'

type DataSourceType = {
  id?: React.Key
  img?: string
  dishId?: number
  price?: number
  dishList?: []
  quantity?: number
}

interface IProps {
  children?: ReactNode
}

function filterDishList(table: DataSourceType[]) {
  return table.map(({ dishId, quantity }) => ({ dishId, quantity }))
}

const OrderMoal: FC<IProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [restaurantValue, setRestaurantValue] = useState<number | undefined>(undefined)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => [])

  const formRef = useRef<ProFormInstance<any>>()
  const editorFormRef = useRef<EditableFormInstance<DataSourceType>>()

  const userId = localStorage.getItem('userId')

  const handleResponse = useHandleResponse()

  const dispatch = useAppDispatch()
  const { isModalOpen, type, orderRecord, searchValue, page } = useAppSelector((state) => state.order)
  const { list: dishList } = useAppSelector((state) => state.dish)
  const [newDishList, setNewDishList] = useState<DishData[]>(dishList)

  const dishOptions = useMemo(() => {
    return newDishList.map((item) => ({ label: item.name, value: item.id as number }))
  }, [newDishList])
  const dishArray = dishOptions.reduce<{ [key: number]: { text: string } }>((acc, item) => {
    acc[item.value] = { text: item.label || '' }
    return acc
  }, {})

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Dish Name',
      key: 'dishId',
      dataIndex: 'dishId',
      valueType: 'select',
      valueEnum: dishArray,
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Dish Name is required',
          },
        ],
      },
      fieldProps: (form: any, { entity, rowIndex }) => ({
        placeholder: 'Please select a dish',
        onChange: (value: any, option: any, record: any) => {
          // 找到选中的菜品的价格
          const selectedDish = dishList?.find((item) => item.id == value)
          const selectedDishPrice = selectedDish?.price
          const selectedDishImg = selectedDish?.img
          console.log('selectedDishPrice', selectedDishPrice, entity)

          const setRowData = editorFormRef.current?.setRowData
          if (setRowData) {
            setRowData(rowIndex, { price: selectedDishPrice, img: selectedDishImg })
          }
        },
      }),
    },
    {
      title: 'Picture',
      dataIndex: 'img',
      editable: false,
      render(dom, entity: any) {
        return <img src={entity.img} style={{ width: 50 }} />
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: false,
      valueType: () => ({
        type: 'money',
        locale: 'en-US',
      }),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Quantity is required',
          },
        ],
      },
      fieldProps: {
        placeholder: 'Please enter quantity',
      },
    },
    {
      title: 'Action',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id as React.Key)
          }}
        >
          Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('dishList') as DataSourceType[]
            console.log(tableDataSource, 'tableDataSource')
            formRef.current?.setFieldsValue({
              dishList: tableDataSource.filter((item) => item.id !== record.id),
            })
            const table: any = editorFormRef.current?.getFieldsValue()
            console.log('dishList', table?.dishList)
            const newTotalPrice = table?.dishList.reduce((acc: number, item: any) => {
              // console.log(item)
              return acc + item.price * item.quantity
            }, 0)
            setTotalPrice(newTotalPrice.toFixed(2))
            console.log('del_newTotalPrice', newTotalPrice)
          }}
        >
          Delete
        </a>,
      ],
    },
  ]

  // 给form表单赋初值
  useEffect(() => {
    console.log('orderRecord', orderRecord)
    if (orderRecord) {
      formRef.current?.setFieldsValue({
        tableId: orderRecord.tableId,
        status: orderRecord.status,
      })
      setRestaurantValue(orderRecord.restaurantId)
      const dishResult = orderRecord.dishArray?.map((dish) => {
        const matchedDish = dishList.find((d) => d.id === dish.dishId)
        return {
          id: dish.dishId as React.Key,
          img: matchedDish?.img,
          dishId: dish.dishId,
          price: matchedDish?.price,
          quantity: dish.quantity,
        }
      })

      const setRowData = editorFormRef.current?.setRowData
      dishResult?.forEach((dish, index) => {
        if (setRowData) {
          setRowData(index, dish)
        }
      })

      const table: any = editorFormRef.current?.getFieldsValue()
      console.log('table', table?.table)
      const newTotalPrice = table?.table.reduce((acc: number, item: any) => {
        return acc + item.price * item.quantity
      }, 0)
      setTotalPrice(newTotalPrice)
    }
  }, [])

  const handleOk = async () => {
    try {
      setIsLoading(true)
      const { tableId, restaurantId, status } = await formRef.current?.validateFields()
      if (type === 'add') {
        const dishArray = filterDishList(editorFormRef.current?.getFieldsValue()?.dishList || [])
        // console.log({ tableId, restaurantId, status, dishArray: dishArray || [], totalPrice })
        const res: any = await addOrder({ userId: Number(userId), tableId, restaurantId, status: status || false, dishes: dishArray || [], totalPrice })
        handleResponse(res, 'Add Success!', 'Add Failed!')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
    setIsLoading(false)
    dispatch(closeDishModal())
  }

  const handleCancel = () => {
    dispatch(closeDishModal())
  }

  const handleSelectChange = (value: any, option: any) => {
    setRestaurantValue(value)
    // 将选中的标签值设置到表单中
    formRef.current?.setFieldsValue({ restaurantId: value })
    setNewDishList(dishList.filter((item) => item.restaurantId == value))
  }
  useEffect(() => {
    // 请求全量菜品数据
    dispatch(getDishList({}))
    console.log('dishList', dishList)
  }, [])

  return (
    <>
      <Modal open={isModalOpen} onOk={handleOk} confirmLoading={isLoading} onCancel={handleCancel} width={900} title={type === 'add' ? 'Add Order' : 'Edit Order'}>
        <ProForm<{
          table: DataSourceType[]
        }>
          style={{ margin: 20 }}
          formRef={formRef}
          validateTrigger="onBlur"
          layout="horizontal"
          submitter={false}
        >
          <ProForm.Item label="Table" name="tableId">
            <Input placeholder="Please enter table number" />
          </ProForm.Item>
          <ProForm.Item label="Restaurant" name="restaurantId">
            <RestaurantSelector selectedValues={restaurantValue} onSelectChange={handleSelectChange} />
          </ProForm.Item>
          <ProForm.Item label="Dish List">
            <EditableProTable<DataSourceType>
              locale={{
                emptyText: 'No Data',
              }}
              rowKey="id"
              scroll={{
                x: 700,
              }}
              editableFormRef={editorFormRef}
              maxLength={5}
              name="dishList"
              recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                creatorButtonText: 'New Row',
              }}
              columns={columns}
              editable={{
                type: 'multiple',
                editableKeys,
                onChange: setEditableRowKeys,
                onSave: async (key, record, newRecord) => {
                  const table: any = editorFormRef.current?.getFieldsValue()
                  console.log('table', table?.dishList)
                  const newTotalPrice = table?.dishList.reduce((acc: number, item: any) => {
                    return acc + item.price * item.quantity
                  }, 0)
                  setTotalPrice(newTotalPrice.toFixed(2))
                  console.log('newTotalPrice', newTotalPrice)
                },
                saveText: 'Save',
                cancelText: 'Cancel',
                actionRender: (row, config, defaultDom) => {
                  console.log(defaultDom.save, defaultDom.cancel)
                  return [defaultDom.save, defaultDom.cancel]
                },
              }}
            />
          </ProForm.Item>
          <ProForm.Item label="Total Pirce" name="total">
            <InputNumber prefix="$" value={totalPrice} disabled />
          </ProForm.Item>
          <ProForm.Item label="Order Status" name="status">
            <Switch />
          </ProForm.Item>
        </ProForm>
      </Modal>
    </>
  )
}
export default memo(OrderMoal)
