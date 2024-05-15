import { Button, Layout, Popover } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { memo, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { useNavigate } from "react-router-dom";

import styles from './Header.module.css'

interface IProps {
  children?: ReactNode
}

const MyHeader: FC<IProps> = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || ''

  const handleLogout = () => {
    // 这里可以添加登出逻辑，例如清除用户状态等
    localStorage.setItem('isLogin', 'false')
    navigate('/login');
  };

  const content = useMemo(() => (<Button onClick={handleLogout}>Logout</Button>), [])

  return (
    <Layout className="header-layout">
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className={styles.header}>Order Management Platform</h2>

        <Popover content={content}>
          <h4 style={{ color: '#fff', display: 'flex', alignItems: 'center', height: 20 }}>{username}</h4>
        </Popover>
      </Header>
    </Layout>
  )
}

export default memo(MyHeader)