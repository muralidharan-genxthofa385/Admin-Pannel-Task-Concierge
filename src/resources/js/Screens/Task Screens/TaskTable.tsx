import { getAllTasks } from '@/Service/TaskTableService/TaskTableService'
import { Calendar1Icon, CircleCheckBig, CircleX, Ellipsis, Eye, RefreshCcw, ToolCase, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox'
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Card } from '@/components/ui/card';
import TextField from '@mui/material/TextField';
import { themes } from '@/Themes';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { getRequest } from '@/Service/Apiservice';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface task_type{
  id:number
    accepted_application:{
proposed_rate:number,
tasker:{
    name:string,
}
}
customer:{
    name:string
}
service:{
    name:string,
    id:number
}

total_hours:number,
total_cost:number,
status:string,
}


interface serviceData {
  id: number;
  base_price: number;
  category: { name: string, id: number };
  name: string
}

const TaskTable:React.FC = () => {
  
  const navigate=useNavigate()

    const [taskDetails,setTaskdetails]=useState<task_type[]>([])
    const [getService,setGetService]=useState<serviceData[]>([])
    const [totalpages,setTotalpages]=useState(0)
    const [paginationModel,setPaginationModel]=useState({page:0, pageSize:15})

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
 


 const [params, setParams] = useState({
  search: '',
  status: '',
  service_id: 0,
  sort_by: 'created_at',
  sort_order: 'desc',
  per_page: 15,
  page: 1,
});

useEffect(()=>{
getRequest(`/services`)
.then((res)=>{
    console.log('service name :',res.data)
    setGetService(res.data.items)
    
})
},[])


     useEffect(()=>{
    const fetchAllTasks=async()=>{
      
        try{
             const res=await getAllTasks(params.search,params.status,params.service_id,params.sort_by,params.sort_order,params.per_page,params.page)
             setTaskdetails(res.data)
             setTotalpages(res.meta.total)
        console.log(res)
            }
        catch(err){
          console.log(err)

        }

    }

   
fetchAllTasks()
    },[params])

    useEffect(()=>{
setParams(prev=>({...prev,page:paginationModel.page+1,per_page:paginationModel.pageSize}))
  },[paginationModel])




    const columns: GridColDef[] = [
  { field: 'service', headerName: 'Service', width: 250,renderCell:(dt)=>(<>{dt.row.service.name}</>)},
    { field: 'customer', headerName: 'Customer', width: 260,renderCell:(dt)=>(<>{dt.row.customer.name}</>) },
      { 
    field: 'accepted_application', 
    headerName: 'Tasker', 
    width: 260,
    renderCell: (dt) => {
      const taskerName = dt.row?.accepted_application?.[0]?.tasker?.name;
      return <>{taskerName ? taskerName : <span className='text-yellow-500'>tasker not assigned yet</span>}</>;
    },
  },
    { field: 'proposed_rate', headerName: 'Poposed Rate', width: 170,renderCell:(dt)=>{
    const rate=dt.row.accepted_application[0]?.proposed_rate
    return <>{rate?`${rate} /hr`:"-" }</>} },
    { field: 'total_cost', headerName: 'Income', width: 160 ,renderCell:(dt)=>(<>{dt.row.total_cost} $</>)},
        { field: 'status', headerName: 'Status', width: 200,renderCell:(dt)=>{
          const taskstatus=dt.row.status

          return<div className='flex items-center h-full justify-center'>{<Typography className={`flex justify-center text-white
             ${taskstatus=="pending"?"bg-yellow-500":taskstatus=="completed"?"bg-green-500":taskstatus=="in_progress"?"bg-amber-500":taskstatus=="accepted"?"bg-purple-500" :"bg-red-500"}`}
             sx={{  fontFamily: "Sora, sans-serif",
            width:"60%",p:0.5,borderRadius:"14px"}}>{taskstatus}</Typography>}</div>
        } },
    { field: 'total_hours', headerName: 'Task Timing', width: 150,renderCell:(dt)=>{
      const totalhours=dt.row.total_hours;
      if(totalhours==null||isNaN(totalhours)) return<>-</>
      if(totalhours>=1){
        return<>{totalhours} hours</>
      }
      else{
        const minutes=Math.round(totalhours*60)
        return<>{minutes} minutes</>
      }
    }},
        { field: 'actions', headerName: 'View', width: 100,renderCell:(dt)=>{
          return(
            <>
<Button >
  <Typography onClick={()=>{ navigate(`/tasks/view/${dt.row.id}`) }}
           className='flex gap-1'><Eye className='text-[var(--color-purple)]'/> </Typography>
</Button>
            </>
          )
        } },

 
];



  return (
    <>
<div>

 <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><ToolCase className='w-6 h-6'/> View Tasks !</h1>

 <div className=' flex flex-col gap-10'>

 <div className='grid grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-4'>
    <HighlightStatsBox icon={Calendar1Icon} title='Scheduled' count={2034}  />
        <HighlightStatsBox icon={RefreshCcw} title='Inprogress' color='#1C96E8' count={2034}  />
    <HighlightStatsBox icon={CircleCheckBig} title='Completed' count={2034} color='green'  />
    <HighlightStatsBox icon={CircleX} title='Cancelled' color='#EB2626' count={2034}  />

 </div>

 <div className='flex flex-col   lg:flex-row  justify-between '>
  <TextField  value={params.search} 
  onChange={(e)=>setParams(prev=>({...prev,search:e.target.value}))}
  label="Search by Name" sx={{...themes.textFieldStyle,width:{xs:"100%",md:"68%"}}}  />
   <FormControl sx={{ ...themes.textFieldStyle, width: {md:"14%",xs:"100%"},mt:{xs:3,md:0} }}  >
            <InputLabel>filter by Status</InputLabel>
            <Select label="Filter by Status"
            value={params.status}
            onChange={(e)=>setParams(prev=>({...prev,status:e.target.value}))}
            >
              
              <MenuItem className='flex gap-2' value={""}>Clear <X className='w-4 h-4' /></MenuItem>
              <MenuItem value={'pending'}>Pending</MenuItem>
              <MenuItem value={'accepted'}>Accepted</MenuItem>
              <MenuItem value={'in_progress'}>In Progress</MenuItem>
              <MenuItem value={'completed'}>Completed</MenuItem>
              <MenuItem value={'cancelled'}>Cancelled</MenuItem>

            </Select>
          </FormControl>

 <FormControl sx={{ ...themes.textFieldStyle, width: {md:"14%",xs:"100%"},mt:{xs:3,md:0} }} >
            <InputLabel>filter by Service</InputLabel>
            <Select label="Filter by Service" 
            value={params.service_id}
            onChange={(e)=>setParams(prev=>({...prev,service_id:e.target.value||Number(e.target.value)}))}
            >
              
              <MenuItem className='flex gap-2' value={""}>Clear <X className='w-4 h-4' /></MenuItem>
              {getService.map((data)=><MenuItem value={data.id}>{data.name}</MenuItem>)}
            </Select>
          </FormControl>

</div>

 <div>
    <Card className='md:w-full w-[100%] h-119'>
      <DataGrid
        rows={taskDetails}
        columns={columns}
        rowCount={totalpages}
       paginationMode='server'
      paginationModel={paginationModel}
  onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        sx={{border:"none"}}
        pageSizeOptions={[5,10,15,20]}
        getRowId={(row)=>row.id}
       
      />
      </Card>

 </div>

 </div>
</div>
    </>
  )
}

export default TaskTable