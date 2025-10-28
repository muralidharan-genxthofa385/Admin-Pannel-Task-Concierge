import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Bolt, Ellipsis,  Eye,  LucideActivitySquare, ShieldAlert, User, UserRoundMinusIcon, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Card } from '@/components/ui/card';
import { themes } from '@/Themes';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import { GetAllCustomers } from '@/Service/Customer Page API Service/Customers_Api_service';


interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_pic_url: string | null;
  rating: number | null;
  created_at: string; 
}

interface taskerCount{
  total:number,
  active: number,
   inactive: number
}


const CustomersScreen:React.FC = () => {

  const navigate=useNavigate()

  const [loading,setLoading]=useState(false)
  const [customerData,setCustomerData]=useState<Customer[]>([])
  
  const [SelectedJobFil, setSelectedJobFil] = useState('')
  const [statusFilter,setStatusFilter]=useState<boolean|null>(null)
const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({page: 0,  pageSize: 15,});
const [totalCount,setTotalCount]=useState(0)
  // const [customercount,setCustomercount]=useState<taskerCount|null>(null)
  const [selectedrowid,setSelectedRowid]=useState<number|null>(null)

const [params, setParams] = useState({
    search: "",
    // min_rating: 0,
    // max_rating: 5,
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



  useEffect(()=>{
    setLoading(true)
GetAllCustomers(params.search,params.sort_by,params.sort_order,params.per_page,params.page)
.then((res)=>{
setCustomerData(res.data)
setTotalCount(res.meta.total)
console.log(res)
console.log('count :')

})
.catch((err)=>console.log('error at fetching taskdata',err))
.finally(()=>setLoading(false))

  },[params])

  useEffect(()=>{
setParams(prev=>({...prev,page:PaginationModel.page+1,per_page:PaginationModel.pageSize}))
  },[PaginationModel])


const handleStatusChange = (event: SelectChangeEvent) => {
  const value = event.target.value;

  if (value === "true") {
    setStatusFilter(true);
    setParams(prev => ({ ...prev, is_available: true }));
  } else if (value === "false") {
    setStatusFilter(false);
    setParams(prev => ({ ...prev, is_available: false }));
  } else if (value === "All") {
    setStatusFilter(null);
    setParams(prev => ({ ...prev, is_available: false }));
  }
};

  const columns: GridColDef[] = [
  { field: 'first_name', headerName: 'Name', width: 180,renderCell:(p)=>(<>{p.row.first_name} {p.row.last_name}</>) },
  { field: 'email', headerName: 'EMail', width: 260 },
  {field:"phone",headerName:'Phone',width:240},

  {field:'place',headerName:"Place",width:200,
   renderCell:(p)=>(
    <>{p.row.user_details?.apartment || 'N/A'}</>
   )
  },
  {field:"created_at",headerName:'Joined By',width:160,renderCell:(d)=>(<>{d.row.created_at.slice(0,10)}</>)},
  {field:"status",headerName:'Status',width:100 , renderCell:(params)=>(
 <span style={{color:params?"green":"red"}}>
  {params.value==false?"🔴 Inactive":"🟢 Active"}</span>
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
        <MenuItem  onClick={()=>{
          navigate(`/customers/view/${selectedrowid}`)
          handleClose}}
           className='flex gap-1'><Eye className='text-[var(--color-purple)]'/> View in Detail</MenuItem>
        <MenuItem onClick={handleClose} className='flex gap-1'><ShieldAlert className='text-[var(--color-red)]' /> Restrict</MenuItem>
      </Menu>
    </div>
  )
}

];


  return (
    <>
 <div>
      <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><Users className='w-6 h-6'/> View Customers !</h1>
      <div className=' flex flex-col gap-10'>

        <div className='grid grid-cos-1 sm:grid-cols-1 gap-5 pt-6 lg:grid-cols-3'>
          <HighlightStatsBox title='Customers' icon={Bolt} color='var(--color-purple)' count={Number(customerData.length)}/>
          <HighlightStatsBox title='Active' icon={LucideActivitySquare} color='var(--color-purple)' count={Number(10)}/>
          <HighlightStatsBox title='Inactive' icon={UserRoundMinusIcon} color='var(--color-purple)' count={Number(4)}/>
        </div>

      {/**----- Filters Section------ */} 
       <div className='w-full flex gap-7'>
<TextField label="Search By Name" className='w-3/4' sx={themes.textFieldStyle} value={params.search} onChange={(e)=>setParams(prev=>({...prev,search:e.target.value}))} />

<FormControl className='w-1/4'>
  <InputLabel>Search By Status</InputLabel>
  <Select 
  onChange={handleStatusChange} 
  value={statusFilter===null?"All":statusFilter.toString()}
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
    <Card className='w-full  h-131'>
<DataGrid
  rows={customerData}
  columns={columns}
  paginationMode="server"
  paginationModel={PaginationModel}
  onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
  pageSizeOptions={[5, 10, 15]}
  rowCount={totalCount}
  loading={loading}
  getRowId={(row) => row.id || `${row.email}-${row.phone}`}  // fallback ID
  sx={{ border: 0, width: { xs:"100%",md:"100%"} }}
/>

    </Card>
</div>{/**----- Data Table Section------ */}

      </div>
      </div>
    </>
  )
}

export default CustomersScreen