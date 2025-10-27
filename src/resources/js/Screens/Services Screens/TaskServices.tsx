import { Card } from '@/components/ui/card'
import { getAllServices } from '@/Service/TaskServicePage/TaskServices_service'
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
import { Ellipsis, FilePen, Settings, Trash2} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


interface serviceData{
   id: number;
   base_price:number;
  category: {name:string,id:number};
   name:string
}

const TaskServices:React.FC = () => {
  const navigate=useNavigate()

  const [loading,setLoading]=useState(false)
  const [serviceData,setserviceData]=useState<serviceData[]>([])
  const [totalCount,setTotalcount]=useState(0)
  const [paginationModel,setPaginationmodel]=useState({page:0,pageSize:10})

  const [params,setParams]=useState({
    category_id:0,
    search:"",
    sort_by:"",
    sort_order:"",
    per_page:10,
    page:0
  })

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
   getAllServices(params.category_id,params.search,params.sort_by,params.sort_order,params.per_page,params.page)
    .then((res)=>{
    setserviceData(res.data.items)
    setTotalcount(res.data.pagination.total)
    console.log(res)
    console.log("pagination :",res.data.pagination.total)
    })
    .catch((err)=>console.log('error at fetching taskdata',err))
    .finally(()=>setLoading(false))
      },[params])

      

    
     const columns: GridColDef[] = [
     { field: 'name', headerName: 'Name', width: 510 },
     {
  field: 'category_id',
    headerName: 'Category Name',
    width: 500,
    renderCell: (params) => (<span>{params.row.category.name || 'Unknown'}</span>), },
     {field:"base_price",headerName:'Base Price',width:390},

   {field:'actions',headerName:"Actions",width:100,
     renderCell:(_params)=>(
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


    
    // const filteredData=serviceData.filter((data)=>{
    //     const nameMatch=data.name.toLowerCase().includes(search.toLowerCase())
    //     const categoryMatch=Category===''||Category.toLowerCase()===data.category?.name?.toLowerCase()
        
    //     return nameMatch&&categoryMatch
    // })



  return (

    <>
<div className='flex flex-col gap-10'>
<h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><Settings className='w-6 h-6'/> Services</h1>

{/**---------- Filter Section---------- */}
<div className='flex flex-col gap-5 md:flex-row w-[100%]'>
  <TextField
    label="Search By Name"
    className="md:w-3/4 w-[22%]"
    value={params.search}
    onChange={(e) => setParams(prev => ({ ...prev, search: e.target.value, page: 0 }))}
    variant="outlined"
    sx={themes.textFieldStyle}
  />

  <FormControl className="md:w-1/4 w-[22%]" sx={themes.textFieldStyle}>
    <InputLabel>Search By Category</InputLabel>
    <Select
      value={params.category_id || ""}
      label="Search By Category"
      onChange={(e) => {
        const selectedId = Number(e.target.value);
        setParams(prev => ({
          ...prev,
          category_id: selectedId,
          page: 0,
        }));
      }}
    >
      <MenuItem value="">
        <em>All Categories</em>
      </MenuItem>
      <MenuItem value={1}>Skilled</MenuItem>
      <MenuItem value={2}>UnSkilled</MenuItem>
      <MenuItem value={3}>Business & Events</MenuItem>
    </Select>
  </FormControl>

  <Button className='w-[10%]' sx={{ ...themes.OutlinedButtonStyle }} onClick={()=>navigate(`/services/Create`)}>
    Add +
  </Button>
</div>
{/**---------- Filter Section---------- */}

<div>
    <Card className='md:w-full w-[17%] h-131'>
      <DataGrid
        rows={serviceData}
        paginationMode='server'
        rowCount={totalCount}
        paginationModel={{page:params.page,pageSize:params.per_page}}
        onPaginationModelChange={(model)=>{
          setPaginationmodel(model)
          setParams(prev=>({...prev,page:model.page,per_page:model.pageSize}))
        }}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10,20]}
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