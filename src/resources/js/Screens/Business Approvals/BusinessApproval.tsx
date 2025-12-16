import { ActivitySquare, Bolt, BriefcaseBusiness, CheckCircle, Edit, PanelTopClose } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox'
import { getRequest, postRequest } from '@/Service/Apiservice'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Card } from '@/components/ui/card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { themes } from '@/Themes'
import { toast } from 'react-toastify'


interface pendingData{
    id: number
    first_name:string;
    last_name:string;
    phone:string;
    reason:string;
    status:string;
    email:string;
}

const BusinessApproval:React.FC = () => {


    const [pendingData,setPendingData]=useState<pendingData[]>([])
    const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({page: 0,  pageSize: 10,});
    const [totalCount,setTotalCount]=useState(0)
      const [loading,setLoading]=useState(false)
    


const fetchPending_approvals=async()=>{
    
    try{
        const res=await getRequest(`admin/pending-registrations`)
        setPendingData(res.data.data)
                console.log( "pending approval >>",pendingData)
    }
    catch(err){}
 
}

    useEffect(()=>{
fetchPending_approvals()
    },[])

    const handleApprove=async(id:number)=>{

        const payload={
            decision: "approve",
  reason: ""
        }

        try{
        
            postRequest(`/admin/pending-registrations/${id}/decision`,payload)
            toast.success('Approved successfully')
            fetchPending_approvals()
        }
        catch(err){

        }

    }

    

     const columns: GridColDef[]=[
          { field: 'first_name', headerName: 'Name', width: 240,renderCell:(p)=>(<>{p.row.first_name} {p.row.last_name}</>) },
         { field: 'phone', headerName: 'Phone', width: 240,renderCell:(p)=>(<>{p.row.phone}</>) },
    { field: 'email', headerName: 'Email', width: 240,renderCell:(p)=>(<>{p.row.email}</>) },
    {field:'status',headerName:'Status',width:200,renderCell:(p)=>(<Box sx={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Typography className={`${p.row.status=="awaiting_approval"?'bg-amber-500':"bg-green-600"} p-2 rounded-3xl text-white`} 
        sx={{display:"flex",alignItems:"center"}}>
        {p.row.status}</Typography> </Box>)},

// {field:"actions",headerName:"Actions",width:200,renderCell:(p)=>{
// <Typography className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
//     <Edit2 size={30}/>{"Edit"}</Typography>}}
{ 
  field: "actions",
  headerName: "Actions",
  width: 200,
  renderCell: (params) => {
    return (
      <Typography
      onClick={()=>handleApprove(params.row.id)}
      sx={{...themes.mediumSizedFont,fontSize:"17px",color:"var(--color-purple)"}} className="flex items-center w-full h-full gap-2 cursor-pointer  hover:text-blue-600">
        <CheckCircle size={20} />
        Approve
      </Typography>
    );
  }
}

     ]

  return (
    <>
    <div>
<h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><BriefcaseBusiness/> Business Approval</h1>

      <div className=' flex flex-col gap-10'>
 <div className='grid grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-3'>
          <HighlightStatsBox color='var(--color-purple)' title='Taskers' icon={Bolt} count={Number(10)}/>
                    <HighlightStatsBox color='var(--color-purple)' title='Active Taskers' icon={ActivitySquare} count={Number(22)||0}/>
          <HighlightStatsBox color='var(--color-purple)' title='Inactive Taskers' icon={PanelTopClose} count={Number(33)||0}/>
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