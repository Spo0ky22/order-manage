import { Select } from 'antd'
import React, { FC, ReactNode, memo, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../tools/store'
import { getRestaurantList } from '../tools/store/actions'

interface IProps {
  children?: ReactNode
  selectedValues: number | undefined
  onSelectChange: (value: any, option: any) => void
}

const RestaurantSelector: FC<IProps> = (props) => {
  const dispatch = useAppDispatch()
  const { list } = useAppSelector((state) => state.restaurant)

  useEffect(() => {
    dispatch(getRestaurantList({}))
  }, [])

  const options = useMemo(() => {
    return list.map((item) => ({ label: item.name, value: item.id }))
  }, [list, props.selectedValues])

  return (
    <div>
      <Select placeholder="Please choose a restaurant" style={{ width: '230px', fontSize: '14' }} options={options} value={props.selectedValues} onChange={props.onSelectChange} />
    </div>
  )
}
export default memo(RestaurantSelector)
