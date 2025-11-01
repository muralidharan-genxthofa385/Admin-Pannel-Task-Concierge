import { Card } from '@/components/ui/card';
import { getRequest } from '@/Service/Apiservice';
import { themes } from '@/Themes';
import  noProfile from '../../../../assets/images/noProfilepic.svg'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { ChevronLeft,CircleDot, Mail, Phone, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


interface bookingdetailstype {
  id: number,
  status: string,
  created_at:string
  notes:string,
  customer:{
  name: string,
    profile_pic_url: string,
    location: string,
    phone:string,
    email:string,

  }
  service: {
    name: string,
    category: {
      name: string,
    }
  },

  scheduled_dates: string,
  scheduled_time: string |number |any,
  location: string,
  applicants: {
    applications: [
      {
        tasker_name: string,
        cover_letter: string,
        proposed_rate: number,
        id: any
      }
    ]
  }
  selected_tasker: {
    name: string,
    profile_pic_url: string,
    location: string,
    phone:string,
    email:string,
    application: {
      proposed_rate: number
    }
  }
  time_logs: {
    start_time: string,
    end_time: string | null
  }[]
  total_worked_seconds: number,

  cost_breakdown:{
    hourly_rate:number,
    cost_per_minute:number,
    total_minutes_worked:number,
    subtotal:number,
  }
}


const ViewTask:React.FC = () => {

const {id}=useParams();
const navigate=useNavigate()

const [taskDetails,setTaskdetails]=useState<bookingdetailstype|null>(null)

useEffect(()=>{

    getRequest(`/bookings/${id}`)
    .then((res)=>{
        console.log(res.data)
        setTaskdetails(res.data)
    })
    .catch((err)=>{console.log(err)})
},[id])

const taskstatus=taskDetails?.status

const convert_time_format=(time:any)=>{
      if (!time || typeof time !== "string") return "";
    const [hours,minutes,_seconds]=time?.split(":").map(Number);
    const suffix=hours>=12?"PM":"AM";
    const hoursformat=hours%12||12
return `${hoursformat}:${minutes.toString().padStart(2, "0")} ${suffix}`

}

  return (
    <div>

<div className=' flex flex-col gap-10 '>
     <h1 className='sm:text-2xl md:text-2xl flex items-center gap-2 cursor-pointer' onClick={()=>{navigate(-1)}}><ChevronLeft /> {taskDetails?.service.name}</h1>

   <div className='w-full flex flex-col   lg:flex-row  gap-3 lg:justify-between'>

    <Card className=' w-full sm:w-full lg:w-[67%] h-max '>
        <Typography sx={{...themes.largeHeading}} className='pl-10 p-3 border-b-2'>Task Details</Typography>
        <div className='p-8 flex flex-col gap-8'>

            <div className='flex items-center justify-between'>
            <div>
                <Typography sx={{...themes.lightFont}}>Status</Typography>
               <Typography className={`flex justify-center text-white items-center gap-1
             ${taskstatus=="pending"?"bg-yellow-500":taskstatus=="completed"?"bg-green-500":taskstatus=="in_progress"?"bg-amber-500":taskstatus=="accepted"?"bg-purple-500" :"bg-red-500"}`}
             sx={{  fontFamily: "Sora, sans-serif",width:"max-content",p:0.5,borderRadius:"14px",fontSize:"small"}}><CircleDot className='w-4 h-4' /> {taskstatus}</Typography>
            </div>
            <div className='w-[40%]'>
                <Typography sx={{...themes.lightFont}}>Task Date</Typography>
               <Typography sx={{...themes.mediumSizedFont,fontSize:"18px"}} >{taskDetails?.scheduled_dates[0]} ,at :{convert_time_format(taskDetails?.scheduled_time)}</Typography>
            </div>
            </div>

             <div className='flex items-center justify-between'>

            <div>
                <Typography sx={{...themes.lightFont}}>Service Name</Typography>
               <Typography sx={{...themes.mediumSizedFont,fontSize:"18px"}}> {taskDetails?.service.name}</Typography>
            </div>
            <div className='w-[40%]'>
                <Typography sx={{...themes.lightFont}}>Created Date</Typography>
               <Typography sx={{...themes.mediumSizedFont,fontSize:"18px"}} >{taskDetails?.created_at.slice(0,10)||""} ,at :{convert_time_format(taskDetails?.created_at.slice(12,19)||"")}</Typography>
            </div>
            </div>

        </div>

    </Card>

    <Card className=' w-full lg:w-[28%]'>
                <Typography sx={{...themes.largeHeading}} className='pl-10 p-3 border-b-2'>Tasker Info</Typography>

                <div className='p-4'>
<div className='flex gap-8 items-center border-b-2 pb-6'>
    <Box component={'img'} className='w-[79px] h-[79px] rounded-full'
     src={taskDetails?.selected_tasker.profile_pic_url} 
    //src={noProfile}
     />
     <div>
        <Typography sx={{...themes.mediumSizedFont}}>{taskDetails?.selected_tasker.name}</Typography>
        <Typography className='text-yellow-400 flex gap-2 items-center'><Star/> 4.9</Typography>
     </div>
</div>
<div className='p-5 flex flex-col gap-3'>
<Typography sx={{...themes.mediumSizedFont,fontWeight:400,fontSize:"18px"}} className='flex gap-3 items-center'><Phone/> {taskDetails?.selected_tasker.phone}</Typography>
<Typography sx={{...themes.mediumSizedFont,fontWeight:400,fontSize:"18px"}} className='flex gap-3 items-center'><Mail/> {taskDetails?.selected_tasker?.email}</Typography>

</div>

</div>
    </Card>
    </div>


<div className='w-full flex flex-col lg:flex-row gap-3 lg:justify-between'>

    <Card className=' w-full lg:w-[67%] h-max'>
        <Typography sx={{...themes.largeHeading}} className='pl-10 p-3 border-b-2'>Description</Typography>
        <div className='p-8 flex flex-col gap-8'>

          {taskDetails?.notes}

        </div>

    </Card>

    <Card className=' w-full lg:w-[28%]'>
                <Typography sx={{...themes.largeHeading}} className='pl-10 p-3 border-b-2'>Customer Info</Typography>

                <div className='p-4'>
<div className='flex gap-8 items-center border-b-2 pb-6'>
    <Box component={'img'} className='w-[79px] h-[79px] rounded-full'
    //  src={taskDetails?.customer.profile_pic_url} 
    src={noProfile}
     />
     <div>
        <Typography sx={{...themes.mediumSizedFont}}>{taskDetails?.customer.name}</Typography>
        <Typography className='text-yellow-400 flex gap-2 items-center'><Star/> 4.9</Typography>
     </div>
</div>
<div className='p-5 flex flex-col gap-3'>
<Typography sx={{...themes.mediumSizedFont,fontWeight:400,fontSize:"18px"}} className='flex gap-3 items-center'><Phone/> {taskDetails?.customer.phone}</Typography>
<Typography sx={{...themes.mediumSizedFont,fontWeight:400,fontSize:"18px"}} className='flex gap-3 items-center'><Mail/> {taskDetails?.customer?.email}</Typography>

</div>

                </div>



    </Card>
    </div>





</div>

    </div>
  )
}

export default ViewTask