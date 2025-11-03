import { Card } from '@/components/ui/card'
import { themes } from '@/Themes'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { ChevronLeft } from 'lucide-react';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { edit_customer, getCustomerById } from '@/Service/Customer Page API Service/Customers_Api_service';

const CustomerEdit:React.FC = () => {


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
    
       const [customerDetails, setCustomerdetails] = useState({
  firsname: "",
  lastName: "",
  email: "",
  phone: "",
  email_verified: false,
  pause_account: false,
  national_insurance_number: "",
  street: "",
  appartment: "",
  pincode: "",
  entity_name: ""
});

    
    useEffect(() => {
  getCustomerById(Number(id))
    .then((res) => {
      console.log("cust:", res.data);

      const customer = res.data.customer;
      const business = customer.business_details?.[0] || {};

      setCustomerdetails({
        firsname: customer.first_name || "",
        lastName: customer.last_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        pause_account: customer.pause_account || false,
        email_verified: customer.email_verified_at ? true : false,
        national_insurance_number: business.vat_number || "",
        street: business.street || "",
        appartment: business.apartment || "",
        pincode: business.postcode || "",
        entity_name:business.entity_name
      });
    })
    .catch((err) => {
      console.error("❌ Error fetching customer:", err);
      toast.error("Failed to load customer data");
    });
}, [id]);

    
        
        const handleEditTasker=()=>{
    const payload = {
      first_name: customerDetails.firsname,
      last_name: customerDetails.lastName,
      email: customerDetails.email,
      phone: customerDetails.phone,
      pause_account: customerDetails.pause_account,
      email_verified: customerDetails.email_verified,
    
      user_details: [
        {
          street: customerDetails.street,
          apartment: customerDetails.appartment,
          postcode: customerDetails.pincode
        }
      ],
    
    };
    
    
            edit_customer(Number(id),payload)
            .then(()=>{
                toast.success('Customer Updated Successfully')
                navigate(-1)
            })
            .catch((err)=>{console.log(err);toast.error('Oops..! Something Went Wrong')})
    
        }
  
  
  
    return (
    <>

<div className='flex justify-between pb-8'>  <h1 className='flex items-center text-xl cursor-pointer' onClick={()=>navigate(-1)}> <ChevronLeft className='w-8 h-8' />{"Edit Customer"}</h1>

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

                                <TextField label="First Name" value={customerDetails.firsname} onChange={(e) => setCustomerdetails(prev => ({ ...prev, firsname: e.target.value }))} sx={themes.textFieldStyle} className='w-[49%]' />
                                <TextField label="Last Name" value={customerDetails.lastName} onChange={(e) => setCustomerdetails(prev => ({ ...prev, lastName: e.target.value }))} sx={themes.textFieldStyle} className='w-[49%]' />
                            </div>
                            <TextField label="Email" value={customerDetails.email} onChange={(e) => setCustomerdetails(prev => ({ ...prev, email: e.target.value }))} sx={themes.textFieldStyle} className='w-[100%] ' />
                            <div className='flex flex-col md:flex-row justify-between gap-3'>
                                <TextField label="Phone" value={customerDetails.phone} onChange={(e) => setCustomerdetails(prev => ({ ...prev, phone: e.target.value }))} sx={themes.textFieldStyle} className='w-[49%]' />
                                 <TextField label="Entity Name" value={customerDetails.entity_name} onChange={(e) => setCustomerdetails(prev => ({ ...prev, entity_name: e.target.value }))} sx={themes.textFieldStyle} className='w-[49%]' />

                            </div>

                        </div>

                    </Card>


                    <Card className='h-max-content'>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Address</h1>
                        <div className='p-5 flex flex-col gap-8'>
                            <TextField label="Street" value={customerDetails.street} sx={themes.textFieldStyle} onChange={(e)=>setCustomerdetails(prev=>({...prev,street:e.target.value}))} className='w-[100%] ' />
                            <div className='flex flex-col md:flex-row justify-between gap-3'>
                                <TextField value={customerDetails.appartment} onChange={(e)=>setCustomerdetails(prev=>({...prev,appartment:e.target.value}))} label="Appartment/suite" sx={themes.textFieldStyle} className='w-[49%]' />
                                <TextField value={customerDetails.pincode} onChange={(e)=>setCustomerdetails(prev=>({...prev,pincode:e.target.value}))}  label="Pin code" sx={themes.textFieldStyle} className='w-[49%]' />
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
                                    <Typography sx={{ ...themes.lightFont, fontSize: "13px" }}>{customerDetails.pause_account ? "Tasker will receive niotifications" : "Tasker will not receive niotifications"}</Typography>
                                </div>
                                <Switch {...label}
                                    checked={customerDetails.pause_account}
                                    onChange={(e) => setCustomerdetails(prev => ({ ...prev, pause_account: e.target.checked }))}
                                    sx={switch_style}
                                />
                            </div>


                            <div className='p-6 flex justify-between'>
                                <div>
                                    <h1>Email Verified</h1>
                                    <Typography sx={{ ...themes.lightFont, fontSize: "13px" }}>{'Email address has been confirmed'}</Typography>
                                </div>
                                <Switch {...label}
                                    checked={customerDetails.email_verified}
                                    onChange={(e) => setCustomerdetails(prev => ({ ...prev, email_verified: e.target.checked }))}
                                    sx={switch_style}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h1 className='p-4 border-b-2 text-2xl font-semibold'>Confedential Information</h1>
                        <div className='p-5'>
                            <TextField fullWidth label="National Insurance Number" sx={themes.textFieldStyle}
                                value={customerDetails.national_insurance_number}
                                onChange={(e) => setCustomerdetails(prev => ({ ...prev, national_insurance_number: e.target.value }))}

                            />

                        </div>
                    </Card>


                   

                </div>{/**---------------right container */}

            </div>

    </>
  )
}

export default CustomerEdit