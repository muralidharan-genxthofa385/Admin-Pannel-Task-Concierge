import { Route } from 'react-router-dom'
import React from 'react'
import { Routes } from 'react-router-dom'
import UserScreen from '@/resources/js/Screens/Taskers screens/UserScreen'
import DashboardLayout from '@/resources/js/Screens/Layouts/DashboardLayout'
import Login from '@/resources/js/Pages/Login'
import CustomersScreen from '@/resources/js/Screens/CustomersScreens/CustomersScreen'
import DashboardHome from '@/resources/js/Screens/Dashboard Home/DashboardHome'
import TaskServices from '@/resources/js/Screens/Services Screens/TaskServices'
import QuestionsScreen from '@/resources/js/Screens/Questions Screens/CreateQuestionsScreen'
import QuestionsDataTable from '@/resources/js/Screens/Questions Screens/QuestionsDataTable'

function AppRouter() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Login/>} />

            <Route path='/Dashboard' element={<DashboardLayout><DashboardHome/></DashboardLayout>}/>
            <Route path='/taskers' element={<DashboardLayout><UserScreen/></DashboardLayout>}/>
            <Route path='/customers' element={<DashboardLayout><CustomersScreen/></DashboardLayout>}/>
            <Route path='/services' element={<DashboardLayout><TaskServices/></DashboardLayout>}/>
            <Route path='/questions/creation' element={<DashboardLayout><QuestionsScreen/></DashboardLayout>}  />
            <Route path='/questions' element={<DashboardLayout><QuestionsDataTable/></DashboardLayout>} />
        </Routes>
    </div>
  )
}

export default AppRouter