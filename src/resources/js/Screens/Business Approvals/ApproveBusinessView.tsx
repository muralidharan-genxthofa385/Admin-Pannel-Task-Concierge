import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Typography from '@mui/material/Typography';
import { CheckCircle, ChevronLeft} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getRequest, postRequest } from '@/Service/Apiservice';
import { Button, Switch, TextField } from '@mui/material';

import { toast } from 'react-toastify';



interface customerdetails {
   
   customer:{ 
    first_name:string,
    last_name:string,
    name:string,
    pause_account:false,
    email_verified_at:string|boolean,
    profile_pic_url:string,
    email:string,
    phone:string
    // date_of_birth:Dayjs|null
    street:string,
    apartment:string,
    location:string,
    business_details:{
companies_house_code:string,
entity_name:string
street:string,
apartment:string,
city:string
state:string
postcode:string


    }[]

}
bookings:bookings,

}
interface bookings{
    completed:any[]
}


const ApproveBusinessView:React.FC = () => {


    
            const navigate=useNavigate()
        const {id}=useParams()

        const location=useLocation()
const {pending_id}=location.state||{}
console.log(pending_id)

 const label = { inputProps: { 'aria-label': 'Switch demo' } };

    const switch_style = {
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'var(--color-purple)',
            '&:hover': {
                backgroundColor: 'rgba(123, 31, 162, 0.1)',
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'var(--color-purple)',
        },
    }


        const [userDetails,setUserdetails]=useState<customerdetails|null>(null)
        const [counts,setCounts]=useState<bookings|null>()
              const [loading,setLoading]=useState(false)
              const [_onCh,setOnch]=useState('')

              const handleChange=(e:any)=>{
                setOnch(e.target.value)
              }
        
        useEffect(()=>{
            const fetchtasker=async()=>{
                try{
                    const res=await getRequest(`admin/customers/${Number(id)}`)
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
        
const handleApprove=async(id:number,decision:string)=>{

      setLoading(true)
      console.log(id,decision)

        const payload={
            decision:decision,
            reason: ""
        }

        try{
        
          await postRequest(`/admin/pending-registrations/${id}/decision`,payload)
            toast.success(payload.decision=="approve"?'Approved successfully':"Applicant Rejected Successfully")
navigate(-1)
        }
        catch(err){

        }
        finally{
          setLoading(false)
        }

    } 

  

    return (

    <>
       <div className='flex justify-between pb-8'>  
        <h1 className='flex items-center text-xl cursor-pointer' onClick={()=>navigate(-1)}> <ChevronLeft className='w-8 h-8' />{"Approve Business User"}</h1>

<div className='flex gap-4 w-[50%] justify-end'>
    <Button sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"15%"}} onClick={()=>navigate(-1)}>Back</Button>
        <Button sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"18%"}} onClick={()=>handleApprove(Number(pending_id),'approve')} className='flex gap-2'>{loading?"Loading...": <><CheckCircle /> Approve</>}</Button>
</div>
</div>
            <div className='w-full flex flex-col md:flex-row justify-between'>


                <div className='w-[100%] md:w-[68%] flex flex-col gap-8'>
                    <Card className='h-max-content'>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Personal Details</h1>
                        <div className='p-5 flex flex-col gap-8'>
                            <div className='flex flex-col md:flex-row justify-between gap-3'>

                                <TextField InputProps={{ readOnly: true }} onChange={handleChange} label="First Name" value={`${userDetails?.customer.first_name}`} sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                                <TextField label="Last Name" value={`${userDetails?.customer.last_name}`} onChange={handleChange}  sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                            </div>
                            <TextField label="Email" value={ `${userDetails?.customer.email}`}  sx={themes.textFieldStyle} className='w-[100%] ' />
                            <div className='flex flex-col md:flex-row justify-between gap-3 '>
                                <TextField label="Phone" value={`+ ${userDetails?.customer.phone}`}  sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                             <TextField  label="Post Code"  value={`${userDetails?.customer.business_details[0]?.postcode||""}`} sx={themes.textFieldStyle} className='w-full md:w-[49%]' />

                            </div>

                        </div>

                    </Card>


                    <Card className='h-max-content'>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Address</h1>
                        <div className='p-5 flex flex-col gap-8'>
                            <TextField  label="Street"  value={`${userDetails?.customer.business_details[0]?.street||""}`} sx={themes.textFieldStyle} className='w-[100%] ' />
                            <div className='flex flex-col md:flex-row justify-between gap-3'>
                                <TextField  label="Appartment/suite"  value={`${userDetails?.customer.business_details[0]?.apartment||""}`} sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                                <TextField  value={`${userDetails?.customer.business_details[0]?.city||""},${userDetails?.customer.business_details[0]?.state||""}`}   label="Location" sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                            </div>


                        </div>

                    </Card>


                </div>{/**---------------left container */}


                <div className='w-[100%] md:w-[30%] flex flex-col gap-8'>

                    <Card>

                        <div>
                            <div className='p-6 flex justify-between'>
                                <div>
                                    <h1>Email Verified</h1>
                                    <Typography sx={{ ...themes.lightFont, fontSize: "13px" }}>{'Email address has been confirmed'}</Typography>
                                </div>
                                <Switch {...label}
                                    checked={userDetails?.customer.email_verified_at==true?true:false}
                                   
                                    sx={switch_style}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Confedential Information</h1>
                        <div className='p-5 flex flex-col gap-8'>
                            <TextField fullWidth label="Company House Code" sx={themes.textFieldStyle}
                                value={`${userDetails?.customer.business_details[0]?.companies_house_code||""   }`}
                            />
                             <TextField fullWidth label="Entity Name" sx={themes.textFieldStyle}
                                value={`${userDetails?.customer.business_details[0]?.entity_name||""}`}
                            />

                        </div>
                    </Card>


                    {/* <Card>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold flex items-center justify-between'><span>Skills</span> <SquarePlus className='text-[var(--color-purple)] cursor-pointer'/></h1>
                        


                    </Card> */}

                </div>{/**---------------right container */}

            </div>
        </>
  )
}

export default ApproveBusinessView