import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Typography from '@mui/material/Typography';
import { Activity, Calendar, CheckCircle, ChevronLeft, History, Mail, PhoneCallIcon, Scale, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskerById } from '@/Service/Taskers_Page_api_service/TaskerspageApi_service';

interface props {
    icon: any,
    title: 'Revenue' | 'Status' | 'Completed_Tasks' | 'Member_Since',
    count: any
}

interface TaskerDetails {
  tasker: {
    name: string;
    pause_account: boolean;
    email_verified_at: string;
    email: string;
    phone: string;
    profile_pic_url: string;
  };
  tasks: {
    completed: any[]; 
  };
  services_done: ServiceDone[];
}

interface ServiceDone {
  id: number;
  name: string;
  description?: string;
}

const TaskerViewScreen: React.FC = () => {
const navigate=useNavigate()
const {id}=useParams()
const [userDetails,setUserdetails]=useState<TaskerDetails|null>(null)

useEffect(()=>{
    const fetchtasker=async()=>{
        try{
            const res=await getTaskerById(Number(id))
            console.log("response :",res)
            setUserdetails(res.data)

        }
        catch{

        }
    }
fetchtasker()


},[id])


    const cardColors = {
        Member_Since: { icon: 'text-orange-500', shadow: 'shadow-[0_0_5px_var(--color-purple)]' },
        Completed_Tasks: { icon: 'text-yellow-500', shadow: 'shadow-[0_0_5px_var(--color-purple)]' },
        Status: { icon: 'text-blue-400', shadow: 'shadow-[0_0_5px_var(--color-purple)]' },
        Revenue: { icon: 'text-green-500', shadow: 'shadow-[0_0_5px_var(--color-purple)]' }
    };
    const RUDashBoardCard: React.FC<props> = ({ icon: Icon, title, count }) => {
        const colors = cardColors[title];
        return (
            <div className={`p-5 sm:p-6 xs:p-2 lg:p-9 flex justify-between rounded-xl  bg-white/10 backdrop-blur-md  
        ${colors.shadow} 
              border border-white/20 transform transition-transform duration-300 cursor-pointer hover:scale-105 `}>
                <h1>
                    <Icon className={`text-[var(--color-purple)] w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 ${colors.icon}`} />
                </h1>
                <div className="flex flex-col items-end">
                    <h2 className={`text-sm sm:text-sm md:text-sm lg:text-2xl text-[var(--color-purple)]  `}>
                        {title.replace(/_/g, " ")}
                    </h2>
                    <h2 className={`text-xs sm:text-base font-medium ms:text-sm  lg:text-2xl ${colors.icon}`}>{count}</h2>
                </div>
            </div>
        );
    };



    return (
        <>
        <Typography className='flex items-center w-max cursor-pointer' onClick={()=>navigate(-1)} sx={{...themes.mediumSizedFont,fontSize:25,color:"var(--color-purple)"}}>
            <ChevronLeft className='w-8 h-8' />{userDetails?.tasker.name}</Typography>
            <div className=' flex flex-col gap-11'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6'>
                    <RUDashBoardCard icon={Wallet} count={100} title='Revenue' />
                    <RUDashBoardCard icon={Activity} count={`${!userDetails?.tasker.pause_account?"active":"Inactive"}`} title='Status' />
                    <RUDashBoardCard icon={Scale} count={userDetails?.tasks.completed.length} title='Completed_Tasks' />
                    <RUDashBoardCard icon={Calendar} count={`${userDetails?.tasker.email_verified_at.slice(0,10)}`} title={`Member_Since`} />
                </div>

                <div className='w-full flex flex-col gap-10 justify-between md:flex-row '>
                    <Card className='w-[100%] md:w-[49%] p-10'>
                        <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>User Information</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Basic user details and contact information</Typography>
                        </div>

                        <div className='flex flex-col gap-7 flex-wrap'>

                            <div className='flex items-center gap-7 flex-wrap'>


                                <img src={userDetails?.tasker.profile_pic_url} className='w-25 p-1 h-25 rounded-full border' />
                                <div>
                                    <Typography sx={{ ...themes.mediumSizedFont}}>{userDetails?.tasker.name}</Typography>
                                    <Typography sx={{ ...themes.lightFont }}>{userDetails?.tasker.email}</Typography>
                                </div>

                            </div>

                            <div className='flex flex-col gap-5'>
                                <Typography className='flex items-center gap-2' sx={{ ...themes.mediumSizedFont, fontSize: 16 }}><Mail /> {userDetails?.tasker.email}</Typography>
                                <Typography className='flex items-center gap-2' sx={{ ...themes.mediumSizedFont, fontSize: 16 }}><PhoneCallIcon /> {userDetails?.tasker.phone}</Typography>

                            </div>
                        </div>

                    </Card>

                    <Card className='w-[100%] md:w-[49%] p-10'>

                        <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Recent Activity</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Latest Task Status and activities</Typography>
                        </div>


                        <div className='pt-3'>
{userDetails?.tasks.completed.length!==0?

<>{userDetails?.tasks.completed.map((data)=><div className='flex w-full justify-between items-center'>
   <div className='flex items-center gap-3'>
        <History className='text-gray-500'/>
<div>
    <Typography sx={{...themes.mediumSizedFont,fontSize:17}}>{data.service.name}</Typography>
    <Typography sx={{...themes.lightFont,fontSize:14}}>{data.scheduled_dates.length===0?data.scheduled_dates[0]:data.scheduled_dates[0]-data.scheduled_dates[data.scheduled_dates.length-1]}</Typography>
    </div>
    </div>
    <Typography className='flex' ><CheckCircle className='w-4 mr-1'/> Completed</Typography>
    

</div>)}</>

:<div className='flex w-full justify-center flex-col items-center gap-3'>
    <History className='w-20 h-20 text-gray-500' />
    <Typography sx={{...themes.mediumSizedFont}}>
        No Recent Activities Recorded
    </Typography>
    </div>}

                        </div>

                    </Card>
                </div>
                <Card className='w-full p-10'>
                     <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Task History</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Complete Transaction History For this user</Typography>
                        </div>


                        {userDetails?.tasks.completed.length!==0?<div>
                            
                        </div>:
                        <div className='flex w-full justify-center flex-col items-center gap-3'>
    <History className='w-20 h-20 text-gray-500' />
    <Typography sx={{...themes.mediumSizedFont}}>
        No Task History Recorded
    </Typography>
    </div>}

                </Card>

            </div>
        </>
    )
}

export default TaskerViewScreen