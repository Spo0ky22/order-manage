import { Button, DatePicker, Input } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import locale from 'antd/es/date-picker/locale/en_US'
import { Dayjs } from 'dayjs'
import type { FC, ReactNode } from 'react'
import RestaurantSelector from '../../components/RestaurantSelector'
import { useAppDispatch, useAppSelector } from '../../tools/store'
import { getOrderList, openOrderModal, setOrderRecord, setOrderSearchValue } from '../../tools/store/actions'

interface IProps {
  children?: ReactNode
}

const { RangePicker } = DatePicker

const SearchBar: FC<IProps> = () => {
  const [dayjs, setDayjs] = useState<any>(null)
  const [dateRange, setDateRange] = useState<string[]>([])
  const [restaurantValue, setRestaurantValue] = useState<number>()
  const [tableValue, setTableValue] = useState<string>()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const { isModalOpen } = useAppSelector((state) => state.order)

  const onTimeChange = (values: any, dateString: [string, string]) => {
    setDateRange(dateString)
    setDayjs(values)
    console.log('dateString', dateString, 'values', values)
  }

  // 点击添加订单处理函数
  const handleAddClick = () => {
    dispatch(
      setOrderRecord({
        tableId: undefined,
        restaurantId: undefined,
        creationTime: '',
        status: 0,
        dishArray: [],
        totalPrice: undefined,
      })
    )
    dispatch(openOrderModal({ type: 'add' }))
    console.log('isopen', isModalOpen)
  }

  // 搜索处理函数
  const handleSearch = () => {
    dispatch(getOrderList({ pageNum: 1, pageSize: 10, creationTime: dateRange, restaurantId: restaurantValue, tableId: tableValue }))
    dispatch(setOrderSearchValue({ creationTime: dateRange, restaurantId: restaurantValue, tableId: tableValue }))
  }

  // 重置搜索处理函数
  const handleReset = () => {
    setTableValue('')
    setDateRange([])
    setRestaurantValue(undefined)
    dispatch(setOrderSearchValue({ creationTime: [], restaurantId: undefined, tableId: '' }))
    dispatch(getOrderList({ pageNum: 1, pageSize: 10 }))
  }

  const handleSelectChange = (value: any, option: any) => {
    console.log('value', value, 'option', option)
    setRestaurantValue(value)
  }
  useEffect(() => {
    const role = localStorage.getItem('username')
    if (role === 'admin') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [])

  return (
    <div className="box-style searchbar">
      <div className="search-box">
        <div className="input-box flex-y-center">
          <span className="search-span">
            <label className="search-label">Restaurant：</label>
            <RestaurantSelector selectedValues={restaurantValue} onSelectChange={handleSelectChange} />
          </span>
        </div>
        <div className="input-box flex-y-center">
          <span className="search-span">
            <label className="search-label">Table：</label>
            <Input style={{ width: 230 }} placeholder={'Please enter a table number'} value={tableValue} onChange={(e) => setTableValue(e.target.value)} />
          </span>
        </div>
        <div className="date-box">
          <span className="search-span">
            <label className="search-label">Creation Time：</label>
            <RangePicker style={{ width: 230 }} locale={locale} value={dayjs} onChange={onTimeChange} />
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
      {isAdmin ? (
        ''
      ) : (
        <div className="add-box">
          <Button type="primary" onClick={handleAddClick}>
            Add
          </Button>
        </div>
      )}
    </div>
  )
}

export default memo(SearchBar)
