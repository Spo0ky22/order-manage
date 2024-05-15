import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { memo, useEffect, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import useTableHeight from '../../hooks/useTableHeight'
import { useAppDispatch, useAppSelector } from '../../tools/store'
import { getDishList, getRestaurantList, openDishModal, setDishRecord } from '../../tools/store/actions'
import { deleteDish } from '../../tools/api'
import useHandleResponse from '../../hooks/useMessage'

interface IProps {
  children?: ReactNode
}

const DishTable: FC<IProps> = () => {
  // 使用自定义hook
  const tableHeight = useTableHeight(390)
  const handleResponse = useHandleResponse()

  const dispatch = useAppDispatch()
  const { list, page, searchValue, tableLoading } = useAppSelector((state) => state.dish)
  const { list: restaurantList } = useAppSelector((state) => state.restaurant)
  // 列名
  const columns: ColumnsType<any> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'key',
        key: 'key',
        width: 120,
        render: (_, __, rowIndex) => rowIndex + 1,
      },
      {
        title: 'Dish Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <p>{text}</p>,
      },
      {
        title: 'Picture',
        dataIndex: 'img',
        key: 'img',
        render: (text) => <img src={text} style={{ width: 80 }} />,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (text) => <p>{text}</p>,
      },
      {
        title: 'Restaurant',
        dataIndex: 'restaurantId',
        key: 'restaurantId',
        render: (id) => (
          <p>
            {restaurantList.map((item) => {
              if (item.id == id) {
                return item.name
              }
            })}
          </p>
        ),
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (text) => <p>{text}</p>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: {
          showTitle: false,
        },
        render: (discription) => (
          <Tooltip placement="topLeft" title={discription}>
            {discription}
          </Tooltip>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'available',
        key: 'available',
        render: (text) => {
          if (text) {
            return <Tag color="success">Listed</Tag>
          } else {
            return <Tag color="error">Delisted</Tag>
          }
        },
      },
      {
        title: 'Action',
        key: 'action',
        width: 160,
        render: (_, record) => (
          <Space size="small">
            <Button type="primary" size="small" onClick={() => handleEditClick(record)}>
              Edit
            </Button>
            <Popconfirm title="Are you sure you want to delete this data?" onConfirm={() => handleDeleteClick(record.id as string)} okText="Confirm" cancelText="Cancel">
              <Button type="primary" size="small" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ]
  }, [restaurantList])

  // 编辑处理函数
  const handleEditClick = (record: any) => {
    dispatch(setDishRecord({ id: record.id, name: record.name, description: record.description, price: record.price, restaurantId: record.restaurantId as number, img: record.img, available: record.available, category: record.category }))
    console.log('record:', record)
    dispatch(openDishModal({ type: 'edit' }))
  }
  // 删除处理函数
  const handleDeleteClick = async (id: string) => {
    try {
      const res: any = await deleteDish(id)
      handleResponse(res, 'Delete Success!', 'Delete Failed!')
      // 如果删除的是当前页最后一条数据，则跳转到前一页
      const updatedDataList = list.filter((item: any) => item.id !== id)
      // 重新获取数据列表
      dispatch(
        getDishList({
          pageNum: page.pageNum ? (updatedDataList.length === 0 ? page.pageNum - 1 : page.pageNum) : 1,
          pageSize: 10,
          name: searchValue?.name,
        })
      )
    } catch (error) {
      console.error('数据删除失败:', error)
    }
  }

  useEffect(() => {
    dispatch(getDishList({ pageNum: 1, pageSize: 10 }))
    dispatch(getRestaurantList({}))
  }, [dispatch])

  // 定义翻页参数
  const pageSetting = useMemo(
    () => ({
      current: page.pageNum || 1,
      pageSize: page.pageSize || 10,
      total: page.total,
      onChange: (page: number, pageSize: number) => {
        dispatch(
          getDishList({
            pageNum: page,
            pageSize: pageSize,
            name: searchValue?.name,
            category: searchValue?.category,
            restaurantId: searchValue?.restaurantId,
          })
        )
      },
    }),
    [page, dispatch, searchValue]
  )

  return (
    <div className="box-style">
      <Table loading={tableLoading} pagination={pageSetting} columns={columns} dataSource={list} bordered scroll={{ y: tableHeight }} />
    </div>
  )
}

export default memo(DishTable)
