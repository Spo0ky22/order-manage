import { Button, Input, Select } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { useAppDispatch } from '../../tools/store'
import { getDishList, openDishModal, setDishRecord, setDishSearchValue } from '../../tools/store/actions'
import RestaurantSelector from '../../components/RestaurantSelector'

interface IProps {
  children?: ReactNode
}

const SearchBar: FC<IProps> = () => {
  const [nameValue, setNameValue] = useState<string>('')
  const [categoryValue, setCategoryValue] = useState<string>('')
  const [restaurantValue, setRestaurantValue] = useState<number>()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  // 点击添加处理函数
  const handleAdd = () => {
    dispatch(setDishRecord({ name: '', description: '', price: 0, category: '', img: undefined, available: true, restaurantId: undefined }))
    dispatch(openDishModal({ type: 'add' }))
  }
  // 搜索处理函数
  const handleSearch = () => {
    dispatch(getDishList({ pageNum: 1, pageSize: 10, name: nameValue, category: categoryValue, restaurantId: restaurantValue }))
    dispatch(setDishSearchValue({ name: nameValue, category: categoryValue, restaurantId: restaurantValue }))
  }

  // 重置搜索处理函数
  const handleReset = () => {
    setNameValue('')
    setCategoryValue('')
    setRestaurantValue(undefined)
    dispatch(setDishSearchValue({ name: '', category: '', restaurantId: undefined }))
    dispatch(getDishList({ pageNum: 1, pageSize: 10 }))
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
            <label className="search-label">Dish name：</label>
            <Input value={nameValue} onChange={(e) => setNameValue(e.target.value)} style={{ width: 230 }} placeholder={'Please enter a name keyword'} />
          </span>
        </div>
        <div className="input-box flex-y-center">
          <span className="search-span">
            <label className="search-label">Category：</label>
            <Input value={categoryValue} onChange={(e) => setCategoryValue(e.target.value)} style={{ width: 230 }} placeholder={'Please enter a category keyword'} />
          </span>
        </div>
        <div className="date-box">
          <span className="search-span">
            <label className="search-label">Restaurant：</label>
            <RestaurantSelector selectedValues={restaurantValue} onSelectChange={handleSelectChange} />
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
        {isAdmin ? (
          ''
        ) : (
          <Button type="primary" onClick={handleAdd}>
            Add
          </Button>
        )}
      </div>
    </div>
  )
}

export default memo(SearchBar)
