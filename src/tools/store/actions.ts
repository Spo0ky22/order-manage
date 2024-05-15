import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchRestaurantList, GetRestaurantListParams, GetDishListParams, fetchDishList, GetOrderListParams, fetchOrderList, GetUserListParams, fetchUserList } from '../api'

interface OpenModalPayload {
  type: 'add' | 'edit'
}

interface UserPayload {
  id?: number
  username?: string
  phone?: string
  email?: string
  firstname?: string
  lastname?: string
  password?: string
}

interface RestaurantPayload {
  id?: number
  userId?: number
  name: string
  address: string
  phone: string
}

interface DishPayload {
  id?: number
  restaurantId?: number
  name?: string
  category?: string
  description?: string
  price?: number
  img?: string
  available?: boolean
}

interface OrderPayload {
  id?: number
  tableId?: number
  restaurantId?: number
  creationTime?: string
  status?: number
  dishArray?: { dishId: number; quantity: number }[]
  totalPrice?: number
}

// Login操作
export const setLogin = createAction<boolean>('login/setLogin')
export const setUsername = createAction<string>('login/setUsername')

// user操作
export const openUserModal = createAction<OpenModalPayload>('user/openUserModal')
export const closeUserModal = createAction<void>('user/closeUserModal')
export const setUserRecord = createAction<UserPayload>('user/setUserRecord')
export const setUserSearchValue = createAction<UserPayload>('user/setUserSearchValue')
export const getUserList = createAsyncThunk('user/getUserList', async ({ username, phone, pageSize, pageNum }: GetUserListParams) => {
  try {
    const response: any = await fetchUserList({ username, phone, pageSize, pageNum })
    return {
      data: response.data,
      // page: {
      //   pageNum: response.data.pageNum,
      //   pageSize: response.data.pageSize,
      //   total: response.data.total
      // }
    }
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
})

// Restaurant操作

export const openRestaurantModal = createAction<OpenModalPayload>('restaurant/openRestaurantModal')
export const closeRestaurantModal = createAction<void>('restaurant/closeRestaurantModal')
// 设置保存当前点击的restaurant信息的操作
export const setRestaurantRecord = createAction<RestaurantPayload>('restaurant/setRestaurantRecord')
// 保存当前查询信息
export const setSearchValue = createAction<string>('restaurant/setSearchValue')

// 获取Restaurant列表操作
export const getRestaurantList = createAsyncThunk('restaurant/getRestaurantList', async ({ name, pageNum, pageSize }: GetRestaurantListParams) => {
  try {
    const response: any = await fetchRestaurantList({ name, pageNum, pageSize })
    return {
      data: response.data.restaurants,
      page: {
        pageNum: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.total,
      },
    }
  } catch (error) {
    // 处理错误情况
    console.error('API Error:', error)
    throw error
  }
})

// Dish操作
export const openDishModal = createAction<OpenModalPayload>('dish/openDishModal')
export const closeDishModal = createAction<void>('dish/closeDishModal')
// 设置保存当前点击的dish信息的操作
export const setDishRecord = createAction<DishPayload>('dish/setDishRecord')
// 保存当前查询信息
export const setDishSearchValue = createAction<DishPayload>('dish/setDishSearchValue')
// 获取Dish列表操作
export const getDishList = createAsyncThunk('dish/getDishList', async ({ restaurantId, category, name, pageNum, pageSize }: GetDishListParams) => {
  try {
    const response: any = await fetchDishList({ restaurantId, category, name, pageNum, pageSize })
    return {
      data: response.data.dishes,
      page: {
        pageNum: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.total,
      },
    }
  } catch (error) {
    // 处理错误情况
    console.error('API Error:', error)
    throw error
  }
})

// Order操作
export const openOrderModal = createAction<OpenModalPayload>('order/openOrderModal')
export const closeOrderModal = createAction<void>('order/closeOrderModal')
// 设置保存当前点击的order信息的操作
export const setOrderRecord = createAction<OrderPayload>('order/setOrderRecord')
// 保存当前查询信息
export const setOrderSearchValue = createAction<any>('order/setOrderSearchValue')
// 获取Order列表操作
export const getOrderList = createAsyncThunk('/order/getOrderList', async (params: GetOrderListParams) => {
  try {
    const response: any = await fetchOrderList(params)
    return {
      data: response.data.orderQueryResps,
      page: {
        pageNum: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.total,
      },
    }
  } catch (error) {
    // 处理错误情况
    console.error('API Error:', error)
    throw error
  }
})
