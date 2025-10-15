import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Bolt, Flame, User, UserRoundMinusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { get } from '@/Service/Apiservice';

interface props {
    icon: any,
    title: string,
    count:number
}

interface taskerData{
  name:string,
  place:string,
  skills:string
}

function UserScreen() {

  const [loading,setLoading]=useState(false)
  const [taskerData,setTaskerData]=useState<taskerData[]>([])
  const [namesearch,setNamesearch]=useState('')
  const [Skillsearch,setSkillsearch]=useState('')
  const [statusFilter,setStatusFilter]=useState<boolean|null>(null)
  

  useEffect(()=>{
    setLoading(true)
get('/userData')
.then((res)=>{
console.log(res.data)
setTaskerData(res.data)
})
.catch((err)=>console.log('error at fetching taskdata',err))
.finally(()=>setLoading(false))

  },[])


  const handleStatusChange=(event:SelectChangeEvent)=>{
const value=event.target.value

if(value==="true"){
  setStatusFilter(true)
}
else if(value=="false"){
  setStatusFilter(false)
}
else{
  setStatusFilter(null)
}   
  }


  const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 240 },
  { field: 'email', headerName: 'EMail', width: 280 },
  {field:"mobile",headerName:'Phone',width:240},
  {field:"skills",headerName:'Skills',width:190},
  {field:'place',headerName:"Place",width:200},
  {field:"joinedDate",headerName:'Joined',width:190,renderCell:(params:any)=>{
     const date = params.value ? new Date(params.value) : null;
      return <span>{date ? date.toISOString().slice(0, 10) : '—'}</span>;
  }},
  {field:"status",headerName:'Status',width:190 , renderCell:(params)=>(
 <span style={params.value?{color:"green"}:{color:"red"}}>
  {params.value==false?"🔴 Inactive":"🟢 Active"}</span>
  )
}

];
const paginationModel = { page: 0, pageSize: 5 };

// const filtered_Data=taskerData.map((data)=>{

// })

  
  {/**------------------------------------------------------------------------- Reuseable Card ---------------------------------------------------------------------------------------- */}
    const RUDashBoardCard: React.FC<props> = ({ icon: Icon, title, count }) => {
      return (
        <div   className="p-4 sm:p-6 lg:p-9 flex justify-between rounded-xl  bg-white/10 backdrop-blur-md  shadow-[0_0_5px_var(--color-purple)]
                 border border-white/20">
          <h1>
            <Icon className="text-[var(--color-purple)] w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </h1>
          <div className="flex flex-col items-end">
            <h2 className="text-sm sm:text-lg lg:text-2xl text-[var(--color-purple)]">
              {title}
            </h2>
            <h2 className="text-xs sm:text-base lg:text-lg">{count}</h2>
          </div>
        </div>
      );
    };
  
  {/**------------------------------------------------------------------------- Reuseable Card ---------------------------------------------------------------------------------------- */}
  

  return (
    <>
    <div>
      <h1 className='sm:text-4xl md:text-4xl flex items-center gap-3'><User className='w-8 h-8'/> View Users !</h1>
      <div className=' flex flex-col gap-10'>

        <div className='grid grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-3'>
          <RUDashBoardCard title='Taskers' icon={Bolt} count={200}/>
                    <RUDashBoardCard title='Active Taskers' icon={Flame} count={200}/>
          <RUDashBoardCard title='Inactive Taskers' icon={UserRoundMinusIcon} count={200}/>
        </div>

      {/**----- Filters Section------ */} 
       <div className='w-full flex gap-7'>
<TextField label="Search By Name" className='w-3/4' />

<FormControl className='w-1/4'>
  <InputLabel>Search By Status</InputLabel>
  <Select 
  onChange={handleStatusChange} value={statusFilter===null?"All":statusFilter.toString()}
  label='Search By Status' className='w-full'>
<MenuItem value="All">All</MenuItem>
<MenuItem value="true">Active</MenuItem>
<MenuItem value="false">Inactive</MenuItem>
</Select> </FormControl>

<FormControl className='w-1/4' >
  <InputLabel>Search by Jobs</InputLabel>
  <Select label="Search by Jobs">
    {taskerData.map((data,index)=><MenuItem key={index}>{data.skills}</MenuItem>)}
  </Select>
</FormControl>

        </div>{/**----- Filters Section------ */} 

        <div className='overflow-x-auto'>{/**----- Data Table Section------ */}
 <Paper sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
      <DataGrid
        rows={taskerData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0,width:"100%",minWidth:800 }}
        loading={loading}
        
      />
    </Paper>

        </div>{/**----- Data Table Section------ */}

      </div>
      </div>
    </>
  )
}

export default UserScreen