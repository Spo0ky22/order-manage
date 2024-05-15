import React, { FC, ReactNode, memo } from "react";
import SearchBar from './SearchBar'
import OrderTable from "./OrderTable";
import OrderModal from "./OrderModal";
interface IProps {
  children?: ReactNode
}

const OrderIndex: FC<IProps> = () => {
  return (
    <div>
      <SearchBar />
      <OrderTable />
      <OrderModal />
    </div>

  )
}
export default memo(OrderIndex)