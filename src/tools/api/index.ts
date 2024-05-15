import { del, get, post, put } from '../axios/index'
import axios from 'axios';

export interface GetUserListParams {
  username?: string
  phone?: string
  pageNum?: number
  pageSize?: number
}

export interface UserParams {
  id?: number
  username?: string
  phone?: string
  email?: string
  firstname?: string
  lastname?: string
  password?: string
}

export interface GetRestaurantListParams {
  name?: string
  userId?: number
  pageNum?: number
  pageSize?: number
}

export interface RestaurantParams {
  id?: number
  userId?: number
  name?: string
  address?: string
  phone?: string
}

export interface GetDishListParams {
  restaurantId?: number
  category?: string
  name?: string
  pageNum?: number
  pageSize?: number
}

export interface DishParams {
  id?: number
  name?: string
  restaurantId?: number
  description?: string
  price?: number
  img?: File
  available?: boolean
  category?: string
  [key: string]: any; // 允许其他属性
}

export interface GetOrderListParams {
  pageNum?: number
  pageSize?: number
  creationTime?: string[]
  restaurantId?: number
  tableId?: string
}

export interface OrderParams {
  id?: number
  userId: number
  restaurantId?: number
  tableId?: number
  creationTime?: string
  status?: number
  dishes?: { dishId?: number, quantity?: number }[]
  totalPrice?: number
}

export interface PageType {
  pageNum?: number
  pageSize?: number
  total?: number
}

// 登录接口
export function login(data: { username: string, password: string }) {
  return post('/user/login', data)
}
// 注册接口
export function register(data: { username: string, password: string, phone: string, email: string, firstname: string, lastname: string }) {
  return post('/user/register', data)
}

// 获取用户列表接口
export function fetchUserList(params: GetUserListParams) {
  return post('/user/getAllUserId', params)
}

// 新增用户接口
export function addUser(params: UserParams) {
  return post('/user/insert', params)
}

// 编辑用户接口
export function editUser(params: UserParams) {
  return put('/user/update', params)
}

// 删除用户接口
export function deleteUser(id: string) {
  return del('/user/delete', id)
}


// 获取餐厅列表接口
export function fetchRestaurantList(params: GetRestaurantListParams) {
  return post('/restaurant/getByCondition', params)
}

// 新增餐厅接口
export function addRestaurant(params: RestaurantParams) {
  return post('/restaurant/insert', params)
}

// 编辑餐厅接口
export function editRestaurant(params: RestaurantParams) {
  return put('/restaurant/update', params)
}

// 删除餐厅接口
export function deleteRestaurant(id: string) {
  return del('/restaurant/delete', id)
}

// 获取菜品列表接口
export function fetchDishList(params: GetDishListParams) {
  return post('/dish/getByCondition', params)
}

// // 新增菜品接口
// export function addDish(params: DishParams) {
//   return post('/dish/insert', params)
// }

// // 编辑菜品接口
// export function editDish(params: DishParams) {
//   return put('/dish/update', params)
// }

// 新增菜品接口
export function addDish(params: DishParams) {
  const formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });

  console.log('formData:', formData)
  return axios({
    method: 'post',
    url: '/dish/insert',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// 编辑菜品接口
export function editDish(params: DishParams) {
  const formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });

  return axios({
    method: 'put',
    url: '/dish/update',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// 删除菜品接口
export function deleteDish(id: string) {
  return del('/dish/delete', id)
}

// 获取订单列表接口
export function fetchOrderList(params: GetOrderListParams) {
  return post('/order/getByCondition', params)
}

// 新增订单接口
export function addOrder(params: OrderParams) {
  return post('/order/insert', params)
}

// 编辑订单接口
export function editOrder(params: OrderParams) {
  return put('/order/update', params)
}
// 删除订单接口
export function deleteOrder(id: string) {
  return del('/order/delete', id)
}