import { Card } from '@/components/ui/card'
import { getRequest } from '@/Service/Apiservice'
import { themes } from '@/Themes'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Ellipsis, FilePen, Settings, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
interface serviceData{
   id: number;
   base_price:number;
  category: {name:string};
   name:string
}

const TaskServices:React.FC = () => {

    const [Category, setCategory] = useState('')
  const [loading,setLoading]=useState(false)
  const [serviceData,setserviceData]=useState<serviceData[]>([])
  const [search,setSearch]=useState('')

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };


      useEffect(()=>{
        setLoading(true)
            // getRequest(`/services?category_id=1&search=cleaning&sort_by=created_at&sort_order=desc&per_page=10&page=1`)
    getRequest('/services')
    .then((res)=>{
    setserviceData(res.data.items)
    console.log(res.data.items)
    })
    .catch((err)=>console.log('error at fetching taskdata',err))
    .finally(()=>setLoading(false))
      },[])

      
const categoryMap: Record<number, string> = {
  1: 'Skilled',
  2: 'UnSkilled',
  3: 'Business & Events',
};

    
     const columns: GridColDef[] = [
     { field: 'name', headerName: 'Name', width: 510 },
     {
  field: 'category_id',
    headerName: 'Category Name',
    width: 500,
    renderCell: (params) => (<span>{categoryMap[params.row.category_id] || 'Unknown'}</span>), },
     {field:"base_price",headerName:'Base Price',width:390},

   {field:'',headerName:"Actions",width:100,
     renderCell:(params)=>(
         <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
       <Ellipsis/>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose} className='flex gap-3 '><FilePen className='w-4 h-4 text-[var(--color-purple)]'/> <Typography className='text-[var(--color-purple)]'> Edit</Typography></MenuItem>
        <MenuItem onClick={handleClose} className='flex gap-3'><Trash2 className='w-4 h-4 text-red-500'/> <Typography className='text-[var(--color-purple)]'> Delete</Typography></MenuItem>
      </Menu>
    </div>
     )
   }
   ];


    const paginationModel = { page: 0, pageSize: 7 };
    
    const filteredData=serviceData.filter((data)=>{
        const nameMatch=data.name.toLowerCase().includes(search.toLowerCase())
        const categoryMatch=Category===''||Category.toLowerCase()===data.category?.name?.toLowerCase()
        
        return nameMatch&&categoryMatch
    })



  return (

    <>
<div className='flex flex-col gap-10'>
<h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><Settings className='w-6 h-6'/> Services</h1>

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
      <MenuItem value="Business & Events">Business & Events</MenuItem>

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