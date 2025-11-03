import { Card } from '@/components/ui/card'
import { themes } from '@/Themes'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate, useParams } from 'react-router-dom';
import { edit_tasker, getTaskerById } from '@/Service/Taskers_Page_api_service/TaskerspageApi_service';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { ChevronLeft, SquarePlus, Trash2 } from 'lucide-react';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';



const TaskersEdit: React.FC = () => {

    const { id } = useParams()
    const navigate=useNavigate()
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

    const [taskerDetails, setTaskerdetails] = useState({
        firsname: "",
        lastName: "",
        email: "",
        phone: '',
        date_of_birth: null as Dayjs | null,
        email_verified: false,
        pause_account: false,
        national_insurance_number: '',
        skills:[{name:"",id:null}],
        street:"",
        appartment:"",
        pincode:""
    })


    useEffect(() => {
        getTaskerById(Number(id))
            .then((res) => {
                console.log(res.data)
                const data = res.data
                const dob = data.tasker.user_details?.[0]?.date_of_birth || null;
                const nino = data.tasker.user_details?.[0]?.national_insurance_number || ''
                console.log('nino :', nino)
                setTaskerdetails({
                    firsname: data.tasker.first_name,
                    lastName: data.tasker.last_name,
                    email: data.tasker.email,
                    phone: data.tasker.phone,
                    date_of_birth: dob ? dayjs(dob) : null,
                    pause_account: data.tasker.pause_account,
                    email_verified: data.tasker.email_verified_at ? true : false,
                    national_insurance_number: nino,
                    skills:data.tasker.skills,
                    street:data.tasker.user_details?.[0].street,
        appartment: data.tasker.user_details?.[0].apartment,
        pincode:data.tasker.user_details?.[0].postcode


                })
            })
    }, [id])

    
    const handleEditTasker=()=>{
const payload = {
  first_name: taskerDetails.firsname,
  last_name: taskerDetails.lastName,
  email: taskerDetails.email,
  phone: taskerDetails.phone,
  pause_account: taskerDetails.pause_account,
  email_verified: taskerDetails.email_verified,

  user_details: [
    {
      national_insurance_number: taskerDetails.national_insurance_number,
      date_of_birth: taskerDetails.date_of_birth
        ? dayjs(taskerDetails.date_of_birth).format("YYYY-MM-DD")
        : null,
      street: taskerDetails.street,
      apartment: taskerDetails.appartment,
      postcode: taskerDetails.pincode
    }
  ],

  skills: taskerDetails.skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    level: "expert" 
  }))
};


        edit_tasker(Number(id),payload)
        .then(()=>{
            toast.success('Tasker Updated Successfully')
            navigate(-1)
        })
        .catch((err)=>{console.log(err);toast.error('Oops..! Something Went Wrong')})

    }

    return (
        <>
       <div className='flex justify-between pb-8'>  <h1 className='flex items-center text-xl' onClick={()=>navigate(-1)}> <ChevronLeft className='w-8 h-8' />{"Edit Tasker"}</h1>

<div className='flex gap-4 w-[50%] justify-end'>
    <Button sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"15%"}} onClick={()=>navigate(-1)}>Discard</Button>
        <Button sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"15%"}} onClick={handleEditTasker}>Save</Button>
</div>
</div>
            <div className='w-full flex flex-col md:flex-row justify-between'>


                <div className='w-[100%] md:w-[68%] flex flex-col gap-8'>
                    <Card className='h-max-content'>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Personal Details</h1>
                        <div className='p-5 flex flex-col gap-8'>
                            <div className='flex flex-col md:flex-row justify-between gap-3'>

                                <TextField label="First Name" value={taskerDetails.firsname} onChange={(e) => setTaskerdetails(prev => ({ ...prev, firsname: e.target.value }))} sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                                <TextField label="Last Name" value={taskerDetails.lastName} onChange={(e) => setTaskerdetails(prev => ({ ...prev, lastName: e.target.value }))} sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                            </div>
                            <TextField label="Email" value={taskerDetails.email} onChange={(e) => setTaskerdetails(prev => ({ ...prev, email: e.target.value }))} sx={themes.textFieldStyle} className='w-[100%] ' />
                            <div className='flex flex-col md:flex-row justify-between gap-3'>
                                <TextField label="Phone" value={taskerDetails.phone} onChange={(e) => setTaskerdetails(prev => ({ ...prev, phone: e.target.value }))} sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                                <LocalizationProvider dateAdapter={AdapterDayjs} >

                                    <DatePicker value={taskerDetails.date_of_birth} onChange={(newValue) => setTaskerdetails(prev => ({ ...prev, date_of_birth: newValue }))} className='w-full md:w-[49%]' label="Date of Birth" sx={themes.textFieldStyle} />

                                </LocalizationProvider>
                            </div>

                        </div>

                    </Card>


                    <Card className='h-max-content'>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Address</h1>
                        <div className='p-5 flex flex-col gap-8'>
                            <TextField label="Street" value={taskerDetails.street} sx={themes.textFieldStyle} onChange={(e)=>setTaskerdetails(prev=>({...prev,street:e.target.value}))} className='w-[100%] ' />
                            <div className='flex flex-col md:flex-row justify-between gap-3'>
                                <TextField value={taskerDetails.appartment} onChange={(e)=>setTaskerdetails(prev=>({...prev,appartment:e.target.value}))} label="Appartment/suite" sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                                <TextField value={taskerDetails.pincode} onChange={(e)=>setTaskerdetails(prev=>({...prev,pincode:e.target.value}))}  label="Pin code" sx={themes.textFieldStyle} className='w-full md:w-[49%]' />
                            </div>


                        </div>

                    </Card>


                </div>{/**---------------left container */}


                <div className='w-[100%] md:w-[30%] flex flex-col gap-8'>

                    <Card>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Pause Account</h1>

                        <div>
                            <div className='p-6 flex justify-between'>
                                <div>
                                    <h1>Pause Account</h1>
                                    <Typography sx={{ ...themes.lightFont, fontSize: "13px" }}>{taskerDetails.pause_account ? "Tasker will receive niotifications" : "Tasker will not receive niotifications"}</Typography>
                                </div>
                                <Switch {...label}
                                    checked={taskerDetails.pause_account}
                                    onChange={(e) => setTaskerdetails(prev => ({ ...prev, pause_account: e.target.checked }))}
                                    sx={switch_style}
                                />
                            </div>


                            <div className='p-6 flex justify-between'>
                                <div>
                                    <h1>Email Verified</h1>
                                    <Typography sx={{ ...themes.lightFont, fontSize: "13px" }}>{'Email address has been confirmed'}</Typography>
                                </div>
                                <Switch {...label}
                                    checked={taskerDetails.email_verified}
                                    onChange={(e) => setTaskerdetails(prev => ({ ...prev, email_verified: e.target.checked }))}
                                    sx={switch_style}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Confedential Information</h1>
                        <div className='p-5'>
                            <TextField fullWidth label="National Insurance Number" sx={themes.textFieldStyle}
                                value={taskerDetails.national_insurance_number}
                                onChange={(e) => setTaskerdetails(prev => ({ ...prev, national_insurance_number: e.target.value }))}

                            />

                        </div>
                    </Card>


                    <Card>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold flex items-center justify-between'><span>Skills</span> <SquarePlus className='text-[var(--color-purple)] cursor-pointer'/></h1>
                        <div className='p-5 flex flex-col gap-4'>
                            {taskerDetails.skills.map((data,index)=><div> 
                                
                                <div className='flex justify-between items-center'><TextField   variant='standard' value={data?.name}
                              onChange={(e) => {
        const updatedSkills = [...taskerDetails.skills];
        updatedSkills[index] = { ...updatedSkills[index], name: e.target.value };
        setTaskerdetails((prev) => ({ ...prev, skills: updatedSkills }));
      }}
                            />
                            <Trash2
                             onClick={() => {
        const updatedSkills = taskerDetails.skills.filter((_, i) => i !== index);
        setTaskerdetails((prev) => ({ ...prev, skills: updatedSkills }));
      }}
                            /></div>
                            
                            </div>)}

                        </div>


                    </Card>

                </div>{/**---------------right container */}

            </div>
        </>
    )
}

export default TaskersEdit