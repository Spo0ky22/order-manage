import React, { FC, ReactNode, memo, useState } from "react";
import SearchBar from "./SearchBar";
import DishTable from "./DishTable";
import DishModal from "./DishModal";

interface IProps {
  children?: ReactNode
}


const DishIndex: FC<IProps> = () => {
  return (
    <div>
      <SearchBar />
      <DishTable />
      <DishModal />
    </div>
  )
}
export default memo(DishIndex)