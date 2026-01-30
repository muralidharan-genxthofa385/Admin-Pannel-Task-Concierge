import { ActivitySquare, Bolt, BriefcaseBusiness,  Ellipsis,  PanelTopClose, SearchIcon} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox'
import { getRequest} from '@/Service/Apiservice'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Card } from '@/components/ui/card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { getDashboarDetails } from '@/Service/Dashboard Services/DashboardServices'
import { useNavigate } from 'react-router-dom'


interface pendingData{
    id: number
    first_name:string;
    last_name:string;
    phone:string;
    reason:string;
    status:string;
    email:string;
    user_id:number
}
interface dashboarddetailsType {
  services: { name: string; count: number }[];
  taskers: { total: number; active?: number; inactive?: number };
  residents: {
            total: number
        },
        business_users: {
            approved: number,
            rejected: number,
            pending: number
        },
  tasks: {
    accepted: number;
    cancelled: number;
    completed: number;
    in_progress: number;
    pending: number;
    total: number;
  };
}

const BusinessApproval:React.FC = () => {


    const [pendingData,setPendingData]=useState<pendingData[]>([])
    const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({page: 0,  pageSize: 10,});
    const [totalCount,_setTotalCount]=useState(0)
      const [loading,setLoading]=useState(false)
      const navigate=useNavigate()
        const [selectedrowid,setSelectedRowid]=useState<number|null>(null)

       const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>,rowId:number) => {
          setAnchorEl(event.currentTarget);
          setSelectedRowid(rowId)
        };
        const handleClose = () => {
          setAnchorEl(null);
        };
       const [dashboardDetails, setDashboardDetails] = useState<dashboarddetailsType | null>(null);
      
        useEffect(() => {
          getDashboarDetails().then((res) => {
            console.log(res);
            setDashboardDetails(res.data);
          });
          fetchPending_approvals()

        }, []);


   const fetchPending_approvals=async()=>{   
    setLoading(true)
    try{
        const res=await getRequest(`admin/pending-registrations`)
        setPendingData(res.data.data)
                console.log( "pending approval >>",pendingData)
    }
    catch(err){}
    finally{
      setLoading(false)
    }
 
}

    useEffect(()=>{
    },[])

    // const handleApprove=async(id:number,decision:string)=>{

    //   setLoading(true)
    //   console.log(id,decision)

    //     const payload={
    //         decision:decision,
    //         reason: ""
    //     }

    //     try{
        
    //       await postRequest(`/admin/pending-registrations/${id}/decision`,payload)
    //         toast.success(payload.decision=="approve"?'Approved successfully':"Applicant Rejected Successfully")
    //         fetchPending_approvals()
    //     }
    //     catch(err){

    //     }
    //     finally{
    //       setLoading(false)
    //     }

    // }   

     const columns: GridColDef[]=[
          { field: 'first_name', headerName: 'Name', width: 240,renderCell:(p)=>(<>{p.row.first_name} {p.row.last_name}</>) },
         { field: 'phone', headerName: 'Phone', width: 240,renderCell:(p)=>(<>{p.row.phone}</>) },
    { field: 'email', headerName: 'Email', width: 240,renderCell:(p)=>(<>{p.row.email}</>) },
    {field:'status',headerName:'Status',width:200,renderCell:(p)=>(<Box sx={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Typography className={`${p.row.status=="awaiting_approval"?'bg-amber-500':"bg-green-600"} p-2 rounded-3xl text-white`} 
        sx={{display:"flex",alignItems:"center"}}>
        {p.row.status}</Typography> </Box>)},

{ 
  field: "actions",
  headerName: "Actions",
  width: 200,
  renderCell:(d)=>(
 <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(e)=>handleClick(e,d.row.user_id)}
      ><Ellipsis/> </Button>
      <Menu
        id="basic-menu"
         PaperProps={{ sx: { boxShadow: '0.3px 1px 3px rgba(0,0,0,0.1)',borderRadius: '10px', }, }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        {/* /business/approval/:id */}

 <MenuItem onClick={()=>{navigate(`/business/approval/${selectedrowid}`,{state: {pending_id:d.row.id}})}} className='flex gap-2'><SearchIcon className='text-[var(--color-purple)]' /> Verify</MenuItem>
        {/* <MenuItem onClick={()=>{handleApprove(selectedrowid||0,"reject");handleClose();}} className='flex gap-2'><X className='text-[var(--color-red)]' /> Reject</MenuItem> */}
      </Menu>
    </div>
  )
}
     ]


  return (
    <>
    <div>
<h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><BriefcaseBusiness/> Business Approval</h1>

      <div className=' flex flex-col gap-10'>
 <div className=' grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-3 grid'>
          <HighlightStatsBox color='var(--color-purple)' title='Approved' icon={Bolt} count={Number(dashboardDetails?.business_users.approved || 0)}/>
                    <HighlightStatsBox color='var(--color-purple)' title='Pending' icon={ActivitySquare} count={Number(dashboardDetails?.business_users.pending || 0)}/>
          <HighlightStatsBox color='var(--color-purple)' title='Rejected' icon={PanelTopClose} count={Number(dashboardDetails?.business_users.rejected || 0)}/>
        </div>
{/**----- Filters Section------ */} 
       <div className='w-full flex flex-col md:flex-row gap-7'>


       </div>

<Card className='md:w-full  h-131 rounded-2xl'>
<DataGrid
  rows={pendingData??[]}
  columns={columns}
  paginationMode="server"
  paginationModel={PaginationModel}
  onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
  pageSizeOptions={[5, 10, 15]}
  rowCount={totalCount}
  loading={loading}
  getRowId={(row) => row.id || `${row.email}-${row.phone}`}  // fallback ID
  sx={{ border: 0, width: "100%" }}
/>

    </Card>


</div>

    </div>

    </>
  )
}

export default BusinessApproval