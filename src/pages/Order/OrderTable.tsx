import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { memo, useEffect, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import useTableHeight from '../../hooks/useTableHeight'
import useHandleResponse from '../../hooks/useMessage'
import { useAppDispatch, useAppSelector } from '../../tools/store'
import { getOrderList, openOrderModal, setOrderRecord } from '../../tools/store/actions'

interface IProps {
  children?: ReactNode
}

const OrderTable: FC<IProps> = () => {
  // 使用自定义hook
  const tableHeight = useTableHeight(390)
  const handleResponse = useHandleResponse()

  const dispatch = useAppDispatch()
  const { list, page, searchValue, tableLoading } = useAppSelector((state) => state.order)
  // console.log('orderList:', list)
  // 列名
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
      width: 120,
      render: (_, __, rowIndex) => rowIndex + 1,
    },
    {
      title: 'Order Number',
      dataIndex: 'id',
      key: 'id',
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
      title: 'Creation Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Total Price',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => handleEditClick(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure you want to delete this data?" onConfirm={() => handleDeleteClick(record.id as string)} okText="Confirm" cancelText="Cancel">
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    dispatch(getOrderList({ pageNum: 1, pageSize: 10 }))
  }, [dispatch])

  // 编辑处理函数
  const handleEditClick = (record: any) => {
    dispatch(setOrderRecord({ tableId: record.tableId, restaurantId: record.restaurantId, dishArray: record.dishes, status: record.status, totalPrice: record.totalPrice }))
    dispatch(openOrderModal({ type: 'edit' }))
    console.log('编辑')
  }
  // 删除处理函数
  const handleDeleteClick = async (id: string) => {
    console.log('删除')
  }

  // 定义翻页参数
  const pageSetting = useMemo(
    () => ({
      current: page.pageNum || 1,
      pageSize: page.pageSize || 10,
      total: page.total,
      onChange: (page: number, pageSize: number) => {
        dispatch(
          getOrderList({
            pageNum: page,
            pageSize: pageSize,
            creationTime: searchValue?.reactionTime,
            restaurantId: searchValue?.restaurantId,
            tableId: searchValue?.tableId,
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

export default memo(OrderTable)
