import { createReducer } from '@reduxjs/toolkit'
import {
  closeDishModal,
  closeRestaurantModal,
  closeUserModal,
  getDishList,
  getOrderList,
  getRestaurantList,
  getUserList,
  openDishModal,
  openOrderModal,
  openRestaurantModal,
  openUserModal,
  setDishRecord,
  setDishSearchValue,
  setLogin,
  setOrderRecord,
  setRestaurantRecord,
  setSearchValue,
  setUserRecord,
  setUserSearchValue,
  setUsername,
} from './actions'
import { PageType, UserParams } from '../api'

interface UserData extends UserParams {}

interface RestaurantData {
  id?: number
  userId?: number
  name: string
  address: string
  phone: string
}

export interface DishData {
  id?: number
  restaurantId?: number
  name?: string
  description?: string
  price?: number
  available?: boolean
  img?: string
  category?: string
}

interface OrderData {
  id?: number
  tableId?: number
  restaurantId?: number
  creationTime?: string
  status?: number
  dishArray?: { dishId: number; quantity: number }[]
  totalPrice?: number
}

interface UserState {
  list: UserData[]
  isModalOpen: boolean
  type: 'add' | 'edit' | null
  page: PageType
  userRecord: UserData | null
  searchValue: { username?: string; phone?: string } | null
}

interface RestaurantState {
  list: RestaurantData[]
  isModalOpen: boolean
  type: 'add' | 'edit' | null
  page: PageType
  restaurantRecord: RestaurantData | null
  searchValue: string
  tableLoading: boolean
}

interface DishState {
  list: DishData[]
  isModalOpen: boolean
  type: 'add' | 'edit' | null
  page: PageType
  dishRecord: DishData | null
  searchValue: { category?: string; name?: string; restaurantId?: number } | null
  tableLoading: boolean
}

interface OrderState {
  list: OrderData[]
  isModalOpen: boolean
  type: 'add' | 'edit' | null
  page: PageType
  orderRecord: OrderData | null
  searchValue: { restaurantId?: number; tableId?: string; reactionTime?: string[] } | null
  tableLoading: boolean
}

const initialUserState: UserState = {
  list: [],
  isModalOpen: false,
  type: null,
  page: {},
  userRecord: null,
  searchValue: null,
}

const initialRestaurantState: RestaurantState = {
  list: [],
  isModalOpen: false,
  type: null,
  page: {},
  restaurantRecord: null,
  searchValue: '',
  tableLoading: false,
}

const initialDishState: DishState = {
  list: [],
  isModalOpen: false,
  type: null,
  page: {},
  dishRecord: null,
  searchValue: null,
  tableLoading: false,
}

const initialOrderState: OrderState = {
  list: [],
  isModalOpen: false,
  type: null,
  page: {},
  orderRecord: null,
  searchValue: null,
  tableLoading: false,
}

export const userReducer = createReducer(initialUserState, (builder) => {
  builder
    .addCase(getUserList.fulfilled, (state, action) => {
      // 缓存当前user列表数据和page
      state.list = action.payload?.data
      // state.page = action.payload?.page
    })
    .addCase(openUserModal, (state, action) => {
      // 打开时改变modal状态并传递type信息
      state.isModalOpen = true
      state.type = action.payload.type ?? null
    })
    .addCase(closeUserModal, (state, action) => {
      // 关闭时重置type
      state.isModalOpen = false
      state.type = null
    })
    .addCase(setUserRecord, (state, action) => {
      // 缓存表格当前列表数据
      state.userRecord = action.payload
    })
    .addCase(setUserSearchValue, (state, action) => {
      // 缓存当前查询信息
      state.searchValue = action.payload
    })
})

export const restaurantReducer = createReducer(initialRestaurantState, (builder) => {
  builder
    .addCase(getRestaurantList.pending, (state, action) => {
      state.tableLoading = true
    })
    .addCase(getRestaurantList.fulfilled, (state, action) => {
      // 缓存当前restaurant列表数据和page
      state.list = action.payload?.data
      state.page = action.payload?.page
      state.tableLoading = false
    })
    .addCase(getRestaurantList.rejected, (state, action) => {
      state.tableLoading = false
    })
    .addCase(openRestaurantModal, (state, action) => {
      // 打开时改变modal状态并传递type信息
      state.isModalOpen = true
      state.type = action.payload.type ?? null
    })
    .addCase(closeRestaurantModal, (state, action) => {
      // 关闭时重置type
      state.isModalOpen = false
      state.type = null
    })
    .addCase(setRestaurantRecord, (state, action) => {
      // 缓存表格当前列表数据
      state.restaurantRecord = action.payload
    })
    .addCase(setSearchValue, (state, action) => {
      // 缓存当前查询信息
      state.searchValue = action.payload
    })
})

export const dishReducer = createReducer(initialDishState, (builder) => {
  builder
    .addCase(getDishList.pending, (state, action) => {
      state.tableLoading = true
    })
    .addCase(getDishList.fulfilled, (state, action) => {
      // 缓存当前dish列表数据和page
      state.list = action.payload?.data
      state.page = action.payload?.page
      state.tableLoading = false
    })
    .addCase(getDishList.rejected, (state, action) => {
      state.tableLoading = false
    })
    .addCase(openDishModal, (state, action) => {
      // 打开时改变modal状态并传递type信息
      state.isModalOpen = true
      state.type = action.payload.type ?? null
    })
    .addCase(closeDishModal, (state, action) => {
      // 关闭时重置type
      state.isModalOpen = false
      state.type = null
    })
    .addCase(setDishRecord, (state, action) => {
      // 缓存表格当前列表数据
      state.dishRecord = action.payload
    })
    .addCase(setDishSearchValue, (state, action) => {
      // 缓存当前查询信息
      state.searchValue = action.payload
    })
})

export const orderReducer = createReducer(initialOrderState, (builder) => {
  builder
    .addCase(getOrderList.pending, (state, action) => {
      state.tableLoading = true
    })
    .addCase(getOrderList.fulfilled, (state, action) => {
      // 缓存当前order列表数据和page
      state.list = action.payload?.data
      state.page = action.payload?.page
      state.tableLoading = false
    })
    .addCase(getOrderList.rejected, (state, action) => {
      state.tableLoading = false
    })
    .addCase(openOrderModal, (state, action) => {
      // 打开时改变modal状态并传递type信息
      state.isModalOpen = true
      state.type = action.payload.type ?? null
    })
    .addCase(closeDishModal, (state, action) => {
      // 关闭时重置type
      state.isModalOpen = false
      state.type = null
    })
    .addCase(setOrderRecord, (state, action) => {
      // 缓存表格当前列表数据
      state.orderRecord = action.payload
      console.log('orderRecord:', action.payload)
    })
    .addCase(setDishSearchValue, (state, action) => {
      // 缓存当前查询信息
      state.searchValue = action.payload
    })
})
