import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Bolt, Ellipsis,  Eye,  Flame, Pencil,Trash, User, UserRoundMinusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Card } from '@/components/ui/card';
import { delete_Tasker, getAllTaskers } from '@/Service/Taskers_Page_api_service/TaskerspageApi_service';
import { themes } from '@/Themes';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import { toast } from 'react-toastify';
import Chip from '@mui/material/Chip';


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
interface taskerCount{
  total:number,
  active: number,
   inactive: number
}

function UserScreen() {

  const navigate=useNavigate()

  const [loading,setLoading]=useState(false)
  const [taskerData,setTaskerData]=useState<taskerData[]>([])
  // const [namesearch,setNamesearch]=useState('')
  // const [Skillsearch,setSkillsearch]=useState('')
  const [SelectedJobFil, setSelectedJobFil] = useState('')
  // const [statusFilter,setStatusFilter]=useState<boolean|null>(null)
const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({page: 0,  pageSize: 10,});
const [totalCount,setTotalCount]=useState(0)
  const [taskercount,setTaskercount]=useState<taskerCount|null>(null)
  const [selectedrowid,setSelectedRowid]=useState<number|null>(null)

const [params, setParams] = useState({
    search: "",
    // min_rating: 0,
    // max_rating: 5,
    pause_account: null as boolean | null,
    is_verified: false,
    sort_by: "",
    sort_order: "asc",
    per_page: 10,
    page: 1,
  })
  
 const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>,rowId:number) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowid(rowId)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

const fetchAll_taskers=()=>{
   setLoading(true)
getAllTaskers(params.search,params.pause_account,params.is_verified,params.sort_by,params.sort_order,params.per_page,params.page)
.then((res)=>{
setTaskerData(res.data)
setTotalCount(res.meta.total)
setTaskercount(res.counts)
console.log(res)
console.log('count :',taskercount)

})
.catch((err)=>console.log('error at fetching taskdata',err))
.finally(()=>setLoading(false))
}

  useEffect(()=>{
   
fetchAll_taskers()
  },[params])

  useEffect(()=>{
setParams(prev=>({...prev,page:PaginationModel.page+1,per_page:PaginationModel.pageSize}))
  },[PaginationModel])

const handleStatusChange = (e: SelectChangeEvent) => {
  const value = e.target.value;
  if (value === "All") {
    setParams(prev => ({ ...prev, pause_account: null }));
  } else if (value === "Active") {
    setParams(prev => ({ ...prev, pause_account: false }));
  } else if (value === "Inactive") {
    setParams(prev => ({ ...prev, pause_account: true }));
  }
};

const deleteTasker=(taskerid:number)=>{

  delete_Tasker(taskerid)
  .then((res)=>{
console.log(res)
setTaskerData((prev) => prev.filter((t: any) => t.id !== taskerid));
toast.success('Tasker Deleted Successfully')
  })
  .catch((err)=>{
    console.log(err)
  })
}


  const columns: GridColDef[] = [
  { field: 'first_name', headerName: 'Name', width: 180,renderCell:(p)=>(<>{p.row.first_name} {p.row.last_name}</>) },
  { field: 'email', headerName: 'EMail', width: 260 },
  {field:"phone",headerName:'Phone',width:240},
{
  field: "skills",
  headerName: "Skills",
  width: 220,
  renderCell: (params) => {
    const skillsArray = params.row.skills;
    if (!skillsArray || skillsArray.length === 0) return "N/A";
    const skillNames = skillsArray.map((skill: any) => skill.name).join(", ");
    return <>{skillNames}</>;
  },
},


  {field:'place',headerName:"Place",width:200,
   renderCell:(p)=>(
    <>{p.row.user_details?.apartment || 'N/A'}</>
   )
  },
  {field:"user_details",headerName:'Date of Birth',width:160,renderCell:(params:any)=>{
const dob= params.row.user_details?.date_of_birth?params.row.user_details?.date_of_birth.slice(0,10):'-'
    return (<>{dob}
    </>)
  }},
  {field:"status",headerName:'Status',width:100 , renderCell:(params)=>(
 <span style={{color:!params.row.pause_account?"green":"red"}}>
  {params.row.pause_account==true?<Chip className='' color='error' label="Inactive" />:<Chip className='' color='success' label="Active" />}</span>
  )
},
  {field:'profile_pic_url',headerName:"Picture",width:100,
    renderCell:(p)=>(<div className='flex items-center justify-center p-1'><img className='w-10 h-10 rounded-full' src={p.row.profile_pic_url} /></div>)
  },

{field:'actions',headerName:"Actions",width:100,
  renderCell:(d)=>(
 <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(e)=>handleClick(e,d.row.id)}
      ><Ellipsis/> </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
         PaperProps={{ sx: { boxShadow: '0.3px 1px 3px rgba(0,0,0,0.1)',borderRadius: '10px', }, }}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem  onClick={()=>{
          navigate(`/taskers/view/${selectedrowid}`)
          handleClose()}}
           className='flex gap-2'><Eye className='text-[var(--color-purple)]'/> View </MenuItem>
        <MenuItem onClick={()=>{navigate(`/taskers/edit/${selectedrowid}`);handleClose()}} className='flex gap-2'><Pencil className='text-[var(--color-purple)]' /> Edit</MenuItem>
        <MenuItem onClick={()=>{deleteTasker(d.row.id);handleClose();}} className='flex gap-2'><Trash className='text-[var(--color-red)]' /> Delete</MenuItem>

      </Menu>
    </div>
  )
}

];


  return (
    <>
    <div>
      <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><User className='w-6 h-6'/> View Users !</h1>
      <div className=' flex flex-col gap-10'>

        <div className='grid grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-3'>
          <HighlightStatsBox color='var(--color-purple)' title='Taskers' icon={Bolt} count={Number(taskercount?.total)||0}/>
                    <HighlightStatsBox color='var(--color-purple)' title='Active Taskers' icon={Flame} count={Number(taskercount?.active)||0}/>
          <HighlightStatsBox color='var(--color-purple)' title='Inactive Taskers' icon={UserRoundMinusIcon} count={Number(taskercount?.inactive)||0}/>
        </div>

      {/**----- Filters Section------ */} 
       <div className='w-full flex gap-7'>
<TextField label="Search By Name" className='w-3/4' sx={themes.textFieldStyle} value={params.search} onChange={(e)=>setParams(prev=>({...prev,search:e.target.value}))} />

<FormControl className='w-1/4'>
  <InputLabel>Search By Status</InputLabel>
  <Select 
  onChange={handleStatusChange} 
 value={
      params.pause_account === null
        ? "All"
        : params.pause_account
        ? "Inactive"
        : "Active"
    }
  label='Search By Status' className='w-full'>
<MenuItem value="All">All</MenuItem>
<MenuItem value="Active">Active</MenuItem>
<MenuItem value="Inactive">Inactive</MenuItem>
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
</div>{/**----- Data Table Section------ */}

      </div>
      </div>
    </>
  )
}

export default UserScreen