import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Typography from '@mui/material/Typography';
import { Activity, Calendar,  CheckCircle,  ChevronLeft,  History,  Mail, PhoneCallIcon, Scale, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerById } from '@/Service/Customer Page API Service/Customers_Api_service';
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';


interface customerdetails {
   
    name:string,
    pause_account:false,
    email_verified_at:string,
    profile_pic_url:string,
    email:string,
    phone:string,
     task_history:{
 tasks: {
     customer:{
        name:string
     }
    status:string
    service:{
        name:string
    }
    is_paid:boolean
    scheduled_dates:string[]
  }[]
  pagination:{
    current_page: number,
last_page: number
per_page: number
total: number
  }
  }

bookings:bookings,

}
interface bookings{
    completed:any[]
}

const ViewCustomer:React.FC = () => {


    const navigate=useNavigate()
const {id}=useParams()
const [userDetails,setUserdetails]=useState<customerdetails|null>(null)
const [counts,setCounts]=useState<bookings|null>()
const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({page: 0,  pageSize: 10,});
const [totalCount,setTotalCount]=useState(0)
const [loading,setLoading]=useState(false)



useEffect(()=>{
    const fetchtasker=async()=>{
        setLoading(true)
        try{
             const backendPage = PaginationModel.page + 1;
            const res=await getCustomerById(Number(id),backendPage,PaginationModel.pageSize)
            console.log("response :",res)
            setUserdetails(res.data)
            setCounts(res.data.bookings)
            setTotalCount(res?.data?.task_history.pagination?.total??0)
            console.log('bookings : ',counts)

        }
        catch(err){
console.log(err)
        }
        finally{
            setLoading(false)
        }
    }
fetchtasker()


},[id,PaginationModel.page,PaginationModel.pageSize])




const columns: GridColDef[] = [
  {
    field: 'service',
    headerName: 'Service',
    width: 180,
    valueGetter: (_value, row) => row.service?.name_en || row.service?.name || '—',
  },
  {
    field:'customer',
    headerName:"Customer Name",
    width:200,
    valueGetter:(_value,row)=>row.customer?.name || '—'


  },
  {
    field: 'scheduled_dates',
    headerName: 'Scheduled Dates',
    width: 220,
    valueGetter: (_value, row) => {
      if (!row.scheduled_dates || row.scheduled_dates.length === 0) return '—';
      if (row.scheduled_dates.length === 1) return row.scheduled_dates[0];
      return `${row.scheduled_dates[0]} → ${row.scheduled_dates.at(-1)}`;
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: (params) => (
      <span className={`capitalize px-2 py-1 rounded text-sm ${
        params.value === 'in_progress' ? 'bg-blue-100 text-blue-800' :
        params.value === 'completed'   ? 'bg-green-100 text-green-800' :
        params.value === 'cancelled'   ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {params.value || '—'}
      </span>
    ),
  },
  {
    field: 'total_cost',
    headerName: 'Amount',
    width: 120,
    valueFormatter: (value) => value ? `£${Number(value).toFixed(2)}` : '—',
  },
  {
field:"is_paid",headerName:"Payment Status",width:150,
renderCell: (params) => {
  return (
    <Box
      component="span"
      className={`capitalize px-2 py-1 rounded text-sm font-medium w-[100%] ${
        params.value === true
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {params.value === true ? "Paid" : "Unpaid"}
    </Box>
  );
},


  },
  {
    field: 'created_at',
    headerName: 'Created at',
    width: 160,
    valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '—',
  },
];




  return (
    <>
    <Typography className='flex items-center w-max cursor-pointer' onClick={()=>navigate(-1)} sx={{...themes.mediumSizedFont,fontSize:25,color:"var(--color-purple)"}}>
            <ChevronLeft className='w-8 h-8' />{userDetails?.name||"NA"}</Typography>
            <div className=' flex flex-col gap-11'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6'>
                    <HighlightStatsBox icon={Wallet} count={0} title='Revenue' />
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
                                <Typography className='flex items-center gap-2' sx={{ ...themes.mediumSizedFont, fontSize: 16 }}><PhoneCallIcon /> + {userDetails?.phone}</Typography>

                            </div>
                        </div>

                    </Card>

                    <Card className='w-[100%] md:w-[49%] p-10'>

                        <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Recent Activity</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Latest Task Status and activities</Typography>
                        </div>


                        <div className='pt-3'>
{userDetails?.bookings?.completed.length==0?

<>{userDetails?.bookings.completed.map((_data)=><div className='flex w-full justify-between items-center'>
   <div className='flex items-center gap-3'>
        <History className='text-gray-500'/>
{/* <div>
    <Typography sx={{...themes.mediumSizedFont,fontSize:17}}>{data.service.name}</Typography>
    <Typography sx={{...themes.lightFont,fontSize:14}}>{data.scheduled_dates.length===0?data.scheduled_dates[0]:data.scheduled_dates[0]-data.scheduled_dates[data.scheduled_dates.length-1]}</Typography>
    </div> */}
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


                        {/* {userDetails?.bookings.completed.length!==0?<div>
                            
                        </div>:
                        <div className='flex w-full justify-center flex-col items-center gap-3'>
    <History className='w-20 h-20 text-gray-500' />
    <Typography sx={{...themes.mediumSizedFont}}>
        No Task History Recorded
    </Typography>
    </div>} */}

<DataGrid
  rows={userDetails?.task_history?.tasks || []}
  columns={columns}
  paginationMode="server"
  pagination                 
  paginationModel={PaginationModel}
  onPaginationModelChange={setPaginationModel}
  rowCount={totalCount}      
  loading={loading}
  pageSizeOptions={[5, 10, 15, 20, 25]}
  getRowId={(row) => row.id ?? crypto.randomUUID()}
  disableRowSelectionOnClick
  autoHeight                
  sx={{
    border: 0,
    minHeight: 400,  
    '& .MuiDataGrid-columnHeaderTitle': {fontWeight: 'bold',} ,        
    '& .MuiDataGrid-footerContainer': {
      borderTop: '1px solid #e0e0e0',
      minHeight: '52px !important',
      display: 'flex !important',
    },
  }}
/> 


                </Card>

            </div>
        

    </>
  )
}

export default ViewCustomer