import { configureStore } from '@reduxjs/toolkit';
import { dishReducer, orderReducer, restaurantReducer, userReducer } from './reducers';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant: restaurantReducer,
    dish: dishReducer,
    order: orderReducer
  },
});
// 定义类型
type GetStateType = typeof store.getState
type IRootState = ReturnType<GetStateType>
type DispatchType = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch: () => DispatchType = useDispatch

export default store
