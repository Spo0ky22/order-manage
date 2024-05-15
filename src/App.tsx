import React, { useCallback, useEffect, useState } from 'react'
import { CoffeeOutlined, QrcodeOutlined, ShopOutlined, SmileOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, theme } from 'antd';
import MyHeader from './pages/Header/MyHeader'
import OrderIndex from './pages/Order'
import DishIndex from './pages/Dish'
import Login from './pages/Login';
import Register from './pages/Register';
import Qrcode from './pages/Qrcode';
import UserIndex from './pages/User';

import './assets/styles/reset.css'
import './assets/styles/index.css'

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import RestaurantIndex from './pages/Restaurant';
import PrivateRoute from './components/PrivateRoute';


const { Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [currentRoute, setCurrentRoute] = useState<string[]>(['/order'])


  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const location = useLocation()
  const navigate = useNavigate()

  const isLogin = localStorage.getItem('isLogin') === 'true'

  const items: MenuItem[] = [
    getItem('User Management', '/user', <UserOutlined style={{ fontSize: '16px' }} />),
    getItem('Restaurant Management', '/restaurant', <ShopOutlined style={{ fontSize: '16px' }} />),
    getItem('Order Management', '/order', <UnorderedListOutlined style={{ fontSize: '16px' }} />),
    getItem('Dish Management', '/dish', <CoffeeOutlined style={{ fontSize: '16px' }} />),
    getItem('Qrcode Management', '/qrcode', <QrcodeOutlined style={{ fontSize: '16px' }} />),
  ]

  // 定义路由跳转函数
  const onChangeRoute = useCallback(
    (e: any) => {
      const path = location.pathname
      setCurrentRoute([path])
      console.log('path:', path)
      navigate(e.key, { replace: true })
    },
    [setCurrentRoute, location.pathname, navigate]
  )

  useEffect(() => {
    // 页面刷新时更新currentRoute
    const path = location.pathname
    setCurrentRoute([path])
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='*' element={
        <PrivateRoute isAuthenticated={isLogin}>
          <Layout className="wrap">
            <MyHeader />
            <Layout>
              <Sider style={{ background: colorBgContainer }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={230}>
                <div className="demo-logo-vertical" />
                <Menu style={{ marginTop: '10px' }} selectedKeys={currentRoute} mode="inline" items={items} onClick={onChangeRoute} />
              </Sider>
              <Layout>
                <Content>
                  <div style={{ padding: 24, minHeight: 360 }}>
                    <Routes>
                      {/* 设置路由规则和对应的组件 */}
                      <Route path='/user' element={<UserIndex />} />
                      <Route path='/restaurant' element={<RestaurantIndex />} />
                      <Route path="/order" element={<OrderIndex />} />
                      <Route path="/dish" element={<DishIndex />} />
                      <Route path='/qrcode' element={<Qrcode />} />
                      <Route path="/index.html" element={<Navigate to="/order" />} />
                      {/* 如果没有匹配的路由，显示一个默认页面 */}
                      <Route
                        path="*"
                        element={
                          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                            <div style={{ textAlign: 'center' }}>
                              <SmileOutlined style={{ fontSize: 20 }} />
                              <p>Page Not Found</p>
                            </div>
                          </div>
                        }
                      />
                    </Routes>
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center', paddingTop: 10 }}>Copyright ©2023 Created by Mr.Wang</Footer>
              </Layout>
            </Layout>
          </Layout>
        </PrivateRoute>

      } />


    </Routes>

  );
}

export default App;
