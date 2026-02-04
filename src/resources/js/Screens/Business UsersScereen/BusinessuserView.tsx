import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Typography from '@mui/material/Typography';
import { Activity, Calendar, CheckCircle, ChevronLeft, History, Mail, PhoneCallIcon, Scale,  UserCircle2, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
// import { getCustomerById } from '@/Service/Customer Page API Service/Customers_Api_service';
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import { getRequest } from '@/Service/Apiservice';



interface customerdetails {
   
    name:string,
    pause_account:false,
    email_verified_at:string,
    profile_pic_url:string,
    email:string,
    phone:string

bookings:bookings,

}
interface bookings{
    completed:any[]
}


const BusinessuserView:React.FC = () => {

    
        const navigate=useNavigate()
    const {id}=useParams()
    const [userDetails,setUserdetails]=useState<customerdetails|null>(null)
    const [counts,setCounts]=useState<bookings|null>()
    
    useEffect(()=>{
        const fetchtasker=async()=>{
            try{
                const res=await getRequest(`admin/business-users/${id}`)
                console.log("response :",res)
                setUserdetails(res.data)
                setCounts(res.data.bookings)
                console.log('bookings : ',counts)
    
            }
            catch{
    
            }
        }
    fetchtasker()
    
    
    },[id])
    



  return (
     <>
    <Typography className='flex items-center gap-2 w-max cursor-pointer' onClick={()=>navigate(-1)} sx={{...themes.mediumSizedFont,fontSize:21,color:"var(--color-purple)"}}>
            <ChevronLeft className='w-8 h-8' /><UserCircle2/> {userDetails?.name}</Typography>
            <div className=' flex flex-col gap-11'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6'>
                    {/* <RUDashBoardCard icon={Wallet} count={100} title='Revenue' /> */}
                    <HighlightStatsBox icon={Wallet} title='Revenue' count={0} color='var(--color-grey)' />
                    <HighlightStatsBox icon={Activity} count={`${!userDetails?.pause_account?"active":"Inactive"}`} title='Status' />
                    <HighlightStatsBox icon={Scale} count={userDetails?.bookings?.completed.length} title='Completed_Tasks' />
                    <HighlightStatsBox icon={Calendar} count={`${userDetails?.email_verified_at?userDetails?.email_verified_at.slice(0,10):"N/A"}`} title={`Member_Since`} />
                </div>

                <div className='w-full flex flex-col gap-10 justify-between md:flex-row '>
                    <Card className='w-[100%] md:w-[49%] p-10'>
                        <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>User Information</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Basic user details and contact information</Typography>
                        </div>

                        <div className='flex flex-col gap-7 flex-wrap'>

                            <div className='flex items-center gap-7 flex-wrap'>


                                <img src={userDetails?.profile_pic_url} className='w-25 p-1 h-25 rounded-full border' />
                                <div>
                                    <Typography sx={{ ...themes.mediumSizedFont}}>{userDetails?.name}</Typography>
                                    <Typography sx={{ ...themes.lightFont }}>{userDetails?.email}</Typography>
                                </div>

                            </div>

                            <div className='flex flex-col gap-5'>
                                <Typography className='flex items-center gap-2' sx={{ ...themes.mediumSizedFont, fontSize: 16 }}><Mail /> {userDetails?.email}</Typography>
                                <Typography className='flex items-center gap-2' sx={{ ...themes.mediumSizedFont, fontSize: 16 }}><PhoneCallIcon /> {userDetails?.phone}</Typography>

                            </div>
                        </div>

                    </Card>

                    <Card className='w-[100%] md:w-[49%] p-10'>

                        <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Recent Activity</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Latest Task Status and activities</Typography>
                        </div>


                        <div className='pt-3'>
{userDetails?.bookings?.completed.length!==0?

<>{userDetails?.bookings?.completed.map((data)=><div className='flex w-full justify-between items-center'>
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


                        {userDetails?.bookings?.completed.length!==0?<div>
                            
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

export default BusinessuserView