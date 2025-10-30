import { getAllTasks } from '@/Service/TaskTableService/TaskTableService'
import { Calendar1Icon, CircleCheckBig, CircleX, RefreshCcw, ToolCase, X } from 'lucide-react'
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

interface task_type{
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

    const [taskDetails,setTaskdetails]=useState<task_type[]>([])
    const [getService,setGetService]=useState<serviceData[]>([])

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
    console.log('service name :',res.data.items)
    setGetService(res.data.items)
    
})
},[])


     useEffect(()=>{
    const fetchAllTasks=async()=>{
      
        try{
             const res=await getAllTasks(params.search,params.status,params.service_id,params.sort_by,params.sort_order,params.per_page,params.page)
             setTaskdetails(res.data)
        console.log(taskDetails)
        console.log(res.data)
            }
        catch{

        }

    }

   
fetchAllTasks()
    },[params])




    const columns: GridColDef[] = [
  { field: 'service', headerName: 'Service', width: 250,renderCell:(dt)=>(<>{dt.row.service.name}</>)},
    { field: 'customer', headerName: 'Customer', width: 260,renderCell:(dt)=>(<>{dt.row.customer.name}</>) },
      { 
    field: 'accepted_application', 
    headerName: 'Tasker', 
    width: 260,
    renderCell: (dt) => {
      const taskerName = dt.row?.accepted_application?.[0]?.tasker?.name;
      return <>{taskerName ? taskerName : '-'}</>;
    },
  },
    { field: 'proposed_rate', headerName: 'Poposed Rate', width: 200,renderCell:(dt)=>{
    const rate=dt.row.accepted_application[0]?.proposed_rate
    return <>{rate?rate:"-" }</>} },
    { field: 'total_cost', headerName: 'Income', width: 200 },
        { field: 'status', headerName: 'Status', width: 200 },
    { field: 'total_hours', headerName: 'Task Timing', width: 200 },
 
];






  return (
    <>
<div>

 <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><ToolCase className='w-6 h-6'/> View Customers !</h1>

 <div className=' flex flex-col gap-10'>

 <div className='grid grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-4'>
    <HighlightStatsBox icon={Calendar1Icon} title='Scheduled' count={2034}  />
        <HighlightStatsBox icon={RefreshCcw} title='Inprogress' color='#1C96E8' count={2034}  />
    <HighlightStatsBox icon={CircleCheckBig} title='Completed' count={2034} color='green'  />
    <HighlightStatsBox icon={CircleX} title='Cancelled' color='#EB2626' count={2034}  />

 </div>

 <div className='flex flex-col   md:flex-row  justify-between '>
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
            onChange={(e)=>setParams(prev=>({...params,service_id:e.target.value||Number(e.target.value)}))}
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
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        sx={{border:"none"}}
        pageSizeOptions={[5]}
       
      />
      </Card>

 </div>

 </div>
</div>
    </>
  )
}

export default TaskTable