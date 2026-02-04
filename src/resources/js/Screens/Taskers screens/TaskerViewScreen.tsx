import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Typography from '@mui/material/Typography';
import { Activity, Calendar, CheckCircle, ChevronLeft, History, Mail, PhoneCallIcon, Scale, Star, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskerById } from '@/Service/Taskers_Page_api_service/TaskerspageApi_service';
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import Box from '@mui/material/Box';



interface TaskerDetails {
  tasker: {
    name: string;
    rating:string
    pause_account: boolean;
    email_verified_at: string;
    email: string;
    phone: string;
    profile_pic_url: string;
    student_document_url:string
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


 


    return (
        <>
        <Typography className='flex items-center w-max cursor-pointer' onClick={()=>navigate(-1)} sx={{...themes.mediumSizedFont,fontSize:25,color:"var(--color-purple)"}}>
            <ChevronLeft className='w-8 h-8' />{userDetails?.tasker.name}</Typography>
            <div className=' flex flex-col gap-11'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 pt-6'>
                    {/* <RUDashBoardCard icon={Wallet} count={100} title='Revenue' /> */}
                    <HighlightStatsBox icon={Wallet} count={0} title='Revenue'/>
                     <HighlightStatsBox icon={Activity}count={`${!userDetails?.tasker.pause_account?"active":"Inactive"}`} title='Status'/>
                    <HighlightStatsBox icon={Scale}  count={userDetails?.tasks.completed.length} title='Completed Tasks'/>
                    <HighlightStatsBox icon={Scale}  count={userDetails?.tasks.completed.length} title='Cancelled Tasks'/>


                    <HighlightStatsBox icon={Calendar} count={`${userDetails?.tasker.email_verified_at.slice(0,10)}`} title={`Member Since`} />
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
                                <Typography className='flex items-center gap-2' sx={{ ...themes.mediumSizedFont, fontSize: 16 }}><PhoneCallIcon />+ {userDetails?.tasker.phone}</Typography>
                                <Typography className='flex items-center gap-2' sx={{ ...themes.mediumSizedFont, fontSize: 16 }}><Star />{userDetails?.tasker.rating}</Typography>

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
                <Card className='w-[100%] md:w-[49%] p-10'>
                    <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Student Document</Typography>
                            {/* <Typography sx={{ ...themes.lightFont }}>Latest Task Status and activities</Typography> */}
                        </div>
                            <Box component={'img'} src={userDetails?.tasker.student_document_url} className='w-100 h-100' />


                </Card>

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