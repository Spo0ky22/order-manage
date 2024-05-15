import { Select } from "antd";
import React, { FC, ReactNode, memo, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../tools/store";
import { getUserList } from "../tools/store/actions";

interface IProps {
  children?: ReactNode
  selectedValues: number | undefined
  onSelectChange: (value: any, option: any) => void
}

const UserSelector: FC<IProps> = (props) => {
  const dispatch = useAppDispatch()
  const { list } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(getUserList({}))
  }, [])

  const options = useMemo(() => {
    return list.map((item) => ({ label: item.username, value: item.id }))
  }, [list])

  return (
    <div>
      <Select placeholder='Please choose a user'
        style={{ width: '230px', fontSize: '14' }}
        options={options}
        value={props.selectedValues}
        onChange={props.onSelectChange} />
    </div>
  )
}
export default memo(UserSelector)
