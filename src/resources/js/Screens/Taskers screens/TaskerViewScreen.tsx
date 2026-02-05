import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Typography from '@mui/material/Typography';
import { Activity, Calendar, ChevronLeft, History, Mail, PhoneCallIcon, Scale, Star, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskerById } from '@/Service/Taskers_Page_api_service/TaskerspageApi_service';
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getRequest} from '@/Service/Apiservice';



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
    student_document:string
  };
  pagination:{
    current_page: number,
last_page: number
per_page: number
total: number
  }
  task_history:{
 tasks: {
     customer:{
        name:string
     }
    status:string
    service:{
        name:string
    }
    scheduled_dates:string[]
  }[]
  }
 
  services_done: ServiceDone[];
}

interface ServiceDone {
  "":string
}

const TaskerViewScreen: React.FC = () => {
const navigate=useNavigate()
const {id}=useParams()
const [userDetails,setUserdetails]=useState<TaskerDetails|null>(null)
const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({page: 0,  pageSize: 10,});
const [totalCount,setTotalCount]=useState(0)


useEffect(()=>{
    const fetchtasker=async()=>{
        try{

            const res=await getTaskerById(Number(id))
            console.log("response :",res)
            setUserdetails(res.data)
            setTotalCount(res.data.pagination?.total)
           await getRequest(`/admin/documents/onboarding/${res.data.tasker.student_document}`)

      

        }
        catch(err){
            console.log('error fetching tasker details:',err)
        }
    }
fetchtasker()
// fetchDocuments()


},[id])


// const fetchDocuments=async()=>{

// try{
//      const docFetch = await getRequest(`/admin/documents/onboarding/${userDetails?.tasker?.student_document}`)
//           console.log("document fetch response:", docFetch);
// }
// catch(err){
//     console.log('error fetching document:',err) 


// }
// }

useEffect(()=>{ 
setPaginationModel((prev) => ({ ...prev, page: userDetails ? userDetails.pagination.current_page - 1 : 0, pageSize: userDetails ? userDetails.pagination.per_page : 10 }));
},[])


const columns: GridColDef[] = [
  {
    field: 'service',
    headerName: 'Service',
    width: 220,
    valueGetter: (_value, row) => row.service?.name_en || row.service?.name || '—',
  },
  {
    field:'customer',
    headerName:"Customer Name",
    width:250,
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
    width: 110,
    valueFormatter: (value) => value ? `£${Number(value).toFixed(2)}` : '—',
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
        <Typography className='flex items-center w-max cursor-pointer hover:text-purple-500' onClick={()=>navigate(-1)} sx={{...themes.mediumSizedFont,fontSize:25}}>
            <ChevronLeft className='w-8 h-8' />{userDetails?.tasker.name.toLocaleUpperCase()}</Typography>
            <div className=' flex flex-col gap-11'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 pt-6'>
                    {/* <RUDashBoardCard icon={Wallet} count={100} title='Revenue' /> */}
                    <HighlightStatsBox icon={Wallet} count={0} title='Revenue'/>
                     <HighlightStatsBox icon={Activity}count={`${!userDetails?.tasker.pause_account?"active":"Inactive"}`} title='Status'/>
                    <HighlightStatsBox icon={Scale}  count={userDetails?.services_done[0]} title='Completed Tasks'/>
                    <HighlightStatsBox icon={Scale}  count={userDetails?.task_history?.tasks.length} title='Cancelled Tasks'/>


                    <HighlightStatsBox icon={Calendar} count={`${userDetails?.tasker.email_verified_at.slice(0,10)}`} title={`Member Since`} />
                </div>

                <div className='w-full flex flex-col gap-10 justify-between md:flex-row '>
                    <Card className='w-[100%] md:w-[49%] p-10 h-max'>
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
                            <Typography sx={{ ...themes.mediumSizedFont }}>Student Document</Typography>
                            {/* <Typography sx={{ ...themes.lightFont }}>Latest Task Status and activities</Typography> */}
                        </div>
                            <Box component={'img'} src={userDetails?.tasker.student_document_url} className='w-100 h-100' />


                </Card>

                    {/* <Card className='w-[100%] md:w-[49%] p-10'>

                        <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Recent Activity</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Latest Task Status and activities</Typography>
                        </div>


                        <div className='pt-3'>
{userDetails?.task_history?.tasks?.length!==0?

<>{userDetails?.task_history?.tasks?.map((data)=><div className='flex w-full justify-between items-center'>
   <div className='flex items-center gap-3'>
        <History className='text-gray-500'/>
<div>
    <Typography sx={{...themes.mediumSizedFont,fontSize:17}}>{data.service.name}</Typography>
    <Typography sx={{...themes.lightFont,fontSize:14}}>{data.scheduled_dates.length===0?data.scheduled_dates[0]:data.scheduled_dates[0]-data.scheduled_dates[data.scheduled_dates.length-1]}</Typography>
    </div>
    </div>
    <Typography className='flex' ><CheckCircle className='w-4 mr-1'/> {data.status}</Typography>
    

</div>)}</>

:<div className='flex w-full justify-center flex-col items-center gap-3'>
    <History className='w-20 h-20 text-gray-500' />
    <Typography sx={{...themes.mediumSizedFont}}>
        No Recent Activities Recorded
    </Typography>
    </div>}

                        </div>

                    </Card> */}
                </div>
               

                <Card className='w-full p-10'>
                     <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Task History</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Complete Transaction History For this user</Typography>
                        </div>


                        {userDetails?.task_history?.tasks?.length!==0?<div>

<DataGrid
        rows={userDetails?.task_history?.tasks || []}   
        columns={columns}
        paginationMode='server'
        paginationModel={PaginationModel}
        pageSizeOptions={[5, 10, 15]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        rowCount={totalCount}
        getRowId={(row) => row.id}           
        disableRowSelectionOnClick
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8f9fa',
          },
        }}
      />

                            
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