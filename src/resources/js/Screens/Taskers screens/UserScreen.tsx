import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Bolt, Ellipsis,  Flame, User, UserRoundMinusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Card } from '@/components/ui/card';
import { getAllTaskers } from '@/Service/Taskers_Page_api_service/TaskerspageApi_service';
import { themes } from '@/Themes';

interface props {
    icon: any,
    title: string,
    count:number
}

interface taskerData{
  first_name:string,
  last_name:string,
 email:string,
 role:string, 
phone:string,
profile_pic_url:string,
skills:{
  name:string
}
user_details:{
  date_of_birth:string,  
profile_completed:boolean,
apartment:string,
}

}

function UserScreen() {

  const [loading,setLoading]=useState(false)
  const [taskerData,setTaskerData]=useState<taskerData[]>([])
  // const [namesearch,setNamesearch]=useState('')
  // const [Skillsearch,setSkillsearch]=useState('')
  const [SelectedJobFil, setSelectedJobFil] = useState('')
  const [statusFilter,setStatusFilter]=useState<boolean|null>(null)
  const [PaginationModel,setPaginationModel]=useState({page:0,per_page:10})

const [params, setParams] = useState({
    search: "",
    // min_rating: 0,
    // max_rating: 5,
    is_available: false,
    is_verified: false,
    sort_by: "",
    sort_order: "asc",
    per_page: 10,
    page: 1,
  })
  
  console.log(SelectedJobFil)

  useEffect(()=>{
    setLoading(true)
getAllTaskers(params.search,params.is_available,params.is_verified,params.sort_by,params.sort_order,params.per_page,params.page)
.then((res)=>{
setTaskerData(res.data)
console.log(taskerData)

})
.catch((err)=>console.log('error at fetching taskdata',err))
.finally(()=>setLoading(false))

  },[params])


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
  { field: 'first_name', headerName: 'Name', width: 180,renderCell:(p)=>(<>{p.row.first_name} {p.row.last_name}</>) },
  { field: 'email', headerName: 'EMail', width: 260 },
  {field:"phone",headerName:'Phone',width:240},
  {field:"name",headerName:'Skills',width:190,renderCell:(d)=>(<>{d.row.skills?.name||'N/A'}</>)},
  {field:'place',headerName:"Place",width:200,
   renderCell:(p)=>(
    <>{p.row.user_details?.apartment || 'N/A'}</>
   )
  },
  {field:"user_details",headerName:'Date of Birth',width:160,renderCell:(params:any)=>{
const dob=params.row.user_details?.date_of_birth.slice(0,10)
    return (<>{dob}
    </>)
  }},
  {field:"status",headerName:'Status',width:100 , renderCell:(params)=>(
 <span style={{color:params?"green":"red"}}>
  {params.value==false?"🔴 Inactive":"🟢 Active"}</span>
  )
},
  {field:'profile_pic_url',headerName:"Picture",width:100,
    renderCell:(p)=>(<div className='flex items-center justify-center p-1'><img className='w-10 h-10 rounded-full' src={p.row.profile_pic_url} /></div>)
  },

{field:'actions',headerName:"Actions",width:100,
  renderCell:()=>(
    <span style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",cursor:"pointer",alignItems:"center"}}><Ellipsis/></span>
  )
}

];
const paginationModel = { page: 0, pageSize: 7 };

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
      <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><User className='w-6 h-6'/> View Users !</h1>
      <div className=' flex flex-col gap-10'>

        <div className='grid grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-3'>
          <RUDashBoardCard title='Taskers' icon={Bolt} count={200}/>
                    <RUDashBoardCard title='Active Taskers' icon={Flame} count={200}/>
          <RUDashBoardCard title='Inactive Taskers' icon={UserRoundMinusIcon} count={200}/>
        </div>

      {/**----- Filters Section------ */} 
       <div className='w-full flex gap-7'>
<TextField label="Search By Name" className='w-3/4' sx={themes.textFieldStyle} value={params.search} onChange={(e)=>setParams(prev=>({...prev,search:e.target.value}))} />

<FormControl className='w-1/4'>
  <InputLabel>Search By Status</InputLabel>
  <Select 
  onChange={handleStatusChange} value={statusFilter===null?"All":statusFilter.toString()}
  label='Search By Status' className='w-full'>
<MenuItem value="All">All</MenuItem>
<MenuItem value="true">Active</MenuItem>
<MenuItem value="false">Inactive</MenuItem>
</Select>
 </FormControl>

<FormControl className='w-1/4' >
  <InputLabel>Search by Skills</InputLabel>
  <Select label="Search by Jobs" value={SelectedJobFil} onChange={(e)=>setSelectedJobFil(e.target.value as string)}>
    {/* {taskerData.map((data,index)=><MenuItem key={index}  >{data.skills}</MenuItem>)} */}
  </Select>
</FormControl>

        </div>{/**----- Filters Section------ */} 

       <div>
    <Card className='md:w-full w-[17%] h-131'>
      <DataGrid
        rows={taskerData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0,width:{md:"100%"} }}
        loading={loading}
      />
    </Card>
</div>{/**----- Data Table Section------ */}

      </div>
      </div>
    </>
  )
}

export default UserScreen