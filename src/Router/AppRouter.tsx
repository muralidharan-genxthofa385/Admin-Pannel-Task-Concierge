import { Route } from 'react-router-dom'
import React from 'react'
import { Routes } from 'react-router-dom'
import UserScreen from '@/resources/js/Screens/UserScreen'
import DashboardLayout from '@/resources/js/Screens/Layouts/DashboardLayout'
import Login from '@/resources/js/Pages/Login'
import CustomersScreen from '@/resources/js/Screens/CustomersScreen'
import DashboardHome from '@/resources/js/Screens/DashboardHome'

function AppRouter() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Login/>} />

            <Route path='/Dashboard' element={<DashboardLayout><DashboardHome/></DashboardLayout>}/>
            <Route path='/taskers' element={<DashboardLayout><UserScreen/></DashboardLayout>}/>
            <Route path='/customers' element={<DashboardLayout><CustomersScreen/></DashboardLayout>}/>
        </Routes>
    </div>
  )
}

export default AppRouter