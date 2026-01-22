import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import UserScreen from '@/resources/js/Screens/Taskers screens/UserScreen'
import DashboardLayout from '@/resources/js/Screens/Layouts/DashboardLayout'
import Login from '@/resources/js/Pages/Login'
import CustomersScreen from '@/resources/js/Screens/CustomersScreens/CustomersScreen'
import DashboardHome from '@/resources/js/Screens/Dashboard Home/DashboardHome'
import TaskServices from '@/resources/js/Screens/Services Screens/TaskServices'
import QuestionsScreen from '@/resources/js/Screens/Questions Screens/CreateQuestionsScreen'
import QuestionsDataTable from '@/resources/js/Screens/Questions Screens/QuestionsDataTable'
import EditQuestions from '@/resources/js/Screens/Questions Screens/EditQuestions'
import TaskerViewScreen from '@/resources/js/Screens/Taskers screens/TaskerViewScreen'
import ViewCustomer from '@/resources/js/Screens/CustomersScreens/ViewCustomer'
import TaskTable from '@/resources/js/Screens/Task Screens/TaskTable'
import ViewTask from '@/resources/js/Screens/Task Screens/ViewTask'
import TaskersEdit from '@/resources/js/Screens/Taskers screens/TaskersEdit'
import CustomerEdit from '@/resources/js/Screens/CustomersScreens/CustomerEdit'
import BusinessApproval from '@/resources/js/Screens/Business Approvals/BusinessApproval'
import BusinessUserTable from '@/resources/js/Screens/Business UsersScereen/BusinessUserTable'
import SkillsTable from '@/resources/js/Screens/Skills Screens/SkillsTable'
import BusinessuserView from '@/resources/js/Screens/Business UsersScereen/BusinessuserView'
import BusinessUserEdit from '@/resources/js/Screens/Business UsersScereen/BusinessUserEdit'
import PasswordReset from '@/resources/js/Pages/PasswordReset'
import ResetPassOTP from '@/resources/js/Pages/ResetPassOTP'
import NewPassword from '@/resources/js/Pages/NewPassword'
import SkillCategory from '@/resources/js/Screens/Skills Category/SkillCategory'

function AppRouter() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/forgetPassword/mail' element={<PasswordReset/>} />
            <Route path='/EnterOtp' element={<ResetPassOTP/>} />
            <Route path='/setNewpassword' element={<NewPassword/>} />

            <Route path='/Dashboard' element={<DashboardLayout><DashboardHome/></DashboardLayout>}/>

            <Route path='/tasks' element={<DashboardLayout><TaskTable/></DashboardLayout>} />
            <Route path='/tasks/view/:id' element={<DashboardLayout><ViewTask/></DashboardLayout>} />
            

            <Route path='/taskers' element={<DashboardLayout><UserScreen/></DashboardLayout>}/>
            <Route path='/taskers/view/:id' element={<DashboardLayout><TaskerViewScreen/></DashboardLayout>} />
            <Route path='/taskers/edit/:id' element={<DashboardLayout><TaskersEdit/></DashboardLayout>} />

            <Route path='/business/approval' element={<DashboardLayout><BusinessApproval/> </DashboardLayout>} />

            <Route path='/business/user' element={<DashboardLayout><BusinessUserTable/> </DashboardLayout>} />
             <Route path='/business/user/view/:id' element={<DashboardLayout><BusinessuserView/></DashboardLayout>}/>
            <Route path='/business/user/edit/:id' element={<DashboardLayout><BusinessUserEdit/></DashboardLayout>}/>



            <Route path='/skills' element={<DashboardLayout><SkillsTable/></DashboardLayout>}/>
            <Route path='/skill/category' element={<DashboardLayout><SkillCategory/></DashboardLayout>} />


            <Route path='/customers' element={<DashboardLayout><CustomersScreen/></DashboardLayout>}/>
            <Route path='/customers/view/:id' element={<DashboardLayout><ViewCustomer/></DashboardLayout>}/>
            <Route path='/customers/edit/:id' element={<DashboardLayout><CustomerEdit/></DashboardLayout>}/>

            

            <Route path='/services' element={<DashboardLayout><TaskServices/></DashboardLayout>}/>
            

            <Route path='/questions/creation' element={<DashboardLayout><QuestionsScreen/></DashboardLayout>}  />
            <Route path='/questions/edit/:id' element={<DashboardLayout><EditQuestions/></DashboardLayout>} />
            <Route path='/questions' element={<DashboardLayout><QuestionsDataTable/></DashboardLayout>} />
        </Routes>
    </div>
  )
}

export default AppRouter