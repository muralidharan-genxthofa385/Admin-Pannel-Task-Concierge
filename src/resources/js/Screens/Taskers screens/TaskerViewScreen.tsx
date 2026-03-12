import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Typography from '@mui/material/Typography';
import { Activity, Calendar, ChevronLeft, Eye, History, Mail, PhoneCallIcon, Scale, Star, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskerById } from '@/Service/Taskers_Page_api_service/TaskerspageApi_service';
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {  getRequest} from '@/Service/Apiservice';
import {  Modal } from '@mui/material';



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
    is_paid:boolean
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
const [loading,setLoading]=useState(false)
const [docUrl, setDocUrl] = useState<string>("");
const [docLoading, setDocLoading] = useState(false);
const [docError, setDocError] = useState<string | null>(null);
const [renderCertificate,setRenderCertificate]=useState(false)


const fetchtasker=async()=>{
  setLoading(true)
        try{

          const backendPage = PaginationModel.page + 1;

            const res=await getTaskerById(Number(id),backendPage,PaginationModel.pageSize)
            
            console.log("response :",res)
            setUserdetails(res.data)
            setTotalCount(res.data.pagination?.total)
           await getRequest(`/admin/documents/onboarding/${res.data.tasker.student_document}`)

        }
        catch(err){
            console.log('error fetching tasker details:',err)
        }
        finally{
          setLoading(false)
        }
    }

useEffect(()=>{
    
fetchtasker()


},[id,PaginationModel.page,PaginationModel.pageSize])



useEffect(() => { 
  setPaginationModel((prev) => ({ 
    ...prev, 
    page:  userDetails?.pagination?.current_page 
             ? userDetails.pagination.current_page - 1 
             : 0,
    pageSize: userDetails?.pagination?.per_page ?? 10,
  }));
}, [userDetails]);  


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


useEffect(() => {
  if (!userDetails?.tasker?.student_document) return;

  let blobUrl: string | null = null;

const loadDocument = async () => {
  setDocLoading(true);
  setDocError(null);

  try {
    const token = localStorage.getItem("accessToken") || // adjust key if needed
                  localStorage.getItem("token") ||
                  localStorage.getItem("auth_token") ||
                  null;

    if (!token) {
      throw new Error("No auth token found in localStorage");
    }

    console.log("Using token:", token.substring(0, 20) + "...");

    // ────────────────────────────────────────────────────────────────
    // Fix: Normalize base URL (remove trailing slash if present)
    let base = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, '');
    
    // If your API has version prefix like /api/v2, keep it, but avoid double slash
    const path = `/admin/documents/onboarding/${userDetails.tasker.student_document}`.replace(/^\/+/, '');
    
    const url = `${base}/${path}`;
    // ────────────────────────────────────────────────────────────────

    console.log("Fetching document from:", url); // ← add this log to confirm

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw fetch status:", response.status);
    console.log("Raw Content-Type:", response.headers.get("content-type"));

    if (!response.ok) {
      const text = await response.text();
      console.log("Error response body (first 300 chars):", text.substring(0, 300));
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const blob = await response.blob();
    console.log("Blob type:", blob.type);
    console.log("Blob size:", blob.size);

    const blobUrl = URL.createObjectURL(blob);
    setDocUrl(blobUrl);
  } catch (err: any) {
    console.error("Manual fetch failed:", err);
    setDocError(err.message || "Failed to load document");
  } finally {
    setDocLoading(false);
  }
};

  loadDocument();

  return () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  };
}, [userDetails?.tasker?.student_document]);



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

                  <Card className="w-[100%] md:w-[49%] p-10">
  <div>
    <Typography sx={{ ...themes.mediumSizedFont }}>Student Document</Typography>
  </div>

  <Box sx={{ mt: 3 }}>
    {docError ? (
      <Typography color="error.main">
        {docError} — check console + network tab
      </Typography>
    ) : docLoading ? (
      <Typography color="text.secondary">Loading certificate...</Typography>
    ) : docUrl ? (
      <Box
      onClick={()=>{setRenderCertificate(true)}}
        component="img"
        src={docUrl}
        alt="Student document / certificate"
        sx={{
          width: "100%",
          height: "30vh",
          objectFit: "contain",
          border: "1px solid #e5e7eb",
          borderRadius: 1,
          boxShadow: 1,
          backgroundColor: "#f9fafb",
        }}
        onError={() => setDocError("Image failed to display (corrupt or wrong format?)")}
      />
    ) : (
      <Typography color="text.secondary">No document available</Typography>
    )}
  </Box>
  <Eye style={{color:"var(--color-purple)",cursor:"pointer"}} onClick={()=>{setRenderCertificate(true)}}/>
</Card>
                </div>
               

                <Card className='w-full p-4'>
                     <div>
                            <Typography sx={{ ...themes.mediumSizedFont }}>Task History</Typography>
                            <Typography sx={{ ...themes.lightFont }}>Complete Transaction History For this user</Typography>
                        </div>


                        {userDetails?.task_history?.tasks?.length!==0?<div>

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
                        </div>:
                        <div className='flex w-full justify-center flex-col items-center gap-3'>
    <History className='w-20 h-20 text-gray-500' />
    <Typography sx={{...themes.mediumSizedFont}}>
        No Task History Recorded
    </Typography>
    </div>}

                </Card>

<Modal
        open={renderCertificate}
        onClose={()=>setRenderCertificate(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
         sx={{...themes.background_blur, display:"flex",justifyContent:"center",alignItems:"center"}}
      >
      
          <Card style={{padding:2,width:"30%",height:"80%",overflow:"hidden"}}>
            <Box component={'img'} src={`${docUrl}`}  sx={{height:"100%",width:"100%"}}/>

          </Card>

        
      </Modal>




            </div>
        </>
    )
}

export default TaskerViewScreen