import { Card } from '@/components/ui/card'
import { getRequest } from '@/Service/Apiservice'
import { themes } from '@/Themes'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import TextField from '@mui/material/TextField'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Ellipsis, Settings, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
interface taskerData{
   id: number;
  name: string;
  email: string;
  mobile: string;
  skills: string;
  place: string;
  joinedDate?: string;
  status?: boolean;
}
const TaskServices:React.FC = () => {

    const [Category, setCategory] = useState('')
  const [loading,setLoading]=useState(false)
  const [serviceData,setserviceData]=useState<taskerData[]>([])
  const [search,setSearch]=useState('')


      useEffect(()=>{
        setLoading(true)
    getRequest('/userData')
    .then((res)=>{
    console.log(res)
    setserviceData(res)
    })
    .catch((err)=>console.log('error at fetching taskdata',err))
    .finally(()=>setLoading(false))
    
      },[])
    
     const columns: GridColDef[] = [
     { field: 'name', headerName: 'Name', width: 240 },
     { field: 'email', headerName: 'EMail', width: 280 },
     {field:"mobile",headerName:'Phone',width:240},
     {field:"skills",headerName:'Skills',width:190},
     {field:'place',headerName:"Place",width:200},
     {field:"joinedDate",headerName:'Joined',width:160,renderCell:(params:any)=>{
        const date = params.value ? new Date(params.value) : null;
         return <span>{date ? date.toISOString().slice(0, 10) : '—'}</span>;
     }},
     {field:"status",headerName:'Status',width:100 , renderCell:(params)=>(
    <span style={params.value?{color:"green"}:{color:"red"}}>
     {params.value==false?"🔴 Inactive":"🟢 Active"}</span>
     )
   },
   {field:'',headerName:"Actions",width:100,
     renderCell:(params)=>(
       <span style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",cursor:"pointer",alignItems:"center"}}><Ellipsis/></span>
     )
   }
   ];


    const paginationModel = { page: 0, pageSize: 7 };
    
    const filteredData=serviceData.filter((data)=>{
        const nameMatch=data.name.toLowerCase().includes(search.toLowerCase())
        const categoryMatch=Category===''||Category.toLowerCase()===data.skills.toLowerCase()
        
        return nameMatch&&categoryMatch
    })



  return (

    <>
<div className='flex flex-col gap-10'>
<h1 className='sm:text-4xl md:text-4xl flex items-center gap-3'><Settings className='w-8 h-8'/> Services</h1>

{/**---------- Filter Section---------- */}
<div className='flex flex-col gap-5 md:flex-row w-[100%]'>
<TextField label="Search By Name"
  className="md:w-3/4 w-[22%]"
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
  variant="outlined"
  sx={themes.textFieldStyle}
/>
<FormControl  className="md:w-1/4 w-[22%]" sx={themes.textFieldStyle}>
    <InputLabel>Search By Category</InputLabel>
<Select onChange={(e)=>setCategory(e.target.value as string)} value={Category}  label="Search By Category">
        {Category&&<MenuItem className='flex gap-2' value=""><em>Clear </em> <X className='w-5'/></MenuItem>}
    <MenuItem value="Skilled">Skilled</MenuItem>
     <MenuItem value="UnSkilled">UnSkilled</MenuItem>
      <MenuItem value="business&events">Business & Events</MenuItem>

</Select>
</FormControl>
<Button className='w-[10%]' sx={{...themes.OutlinedButtonStyle}}>Add +</Button>
</div>{/**---------- Filter Section---------- */}

<div>
    <Card className='md:w-full w-[17%] h-131'>
      <DataGrid
        rows={filteredData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0,width:{md:"100%"} }}
        loading={loading}
      />
    </Card>
</div>


</div>
    </>
  )
}

export default TaskServices