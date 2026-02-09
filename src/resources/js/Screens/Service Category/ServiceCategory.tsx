import { Card } from '@/components/ui/card'
import { deleteRequest, getRequest, postRequest } from '@/Service/Apiservice'
import { themes } from '@/Themes'
import { Button, Menu, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {  EllipsisIcon, FilePen, HandPlatter, Plus, PlusCircle, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


interface skillCategoryType{
  name_en:string
}


const ServiceCategory:React.FC = () => {


  const [skillCat,setSkillcat]=useState<skillCategoryType[]>([])
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const [loader,setLoader]=useState(false)
    const [selectedrowid, setSelectedRowid] = useState<number | null>(null)
    const [addcategoryOpen,setAddcategoryOpen]=useState(false)
    const [createCategoryPayload,setCreateCategoryPayload]=useState({
      name_en:"",
      name_cy:""
    })

        const [editcategoryOpen,setEditcategoryOpen]=useState(false)
    const [EditCategoryPayload,setEditCategoryPayload]=useState({
      name_en:"",
      name_cy:""
    })


  const open = Boolean(anchorEl);
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleClick = (e: React.MouseEvent<HTMLElement>, rowId: number) => {
      setAnchorEl(e.currentTarget);
      setSelectedRowid(rowId)
    };



  const fetch_serviceCategories=async()=>{

    try{
  const res=await getRequest(`services/categories`)
    setSkillcat(res.data)
  console.log(skillCat)
    }
    
catch{

}
  }
  useEffect(()=>{
    fetch_serviceCategories()
  },[])


  const delete_category=async(cat_id:any)=>{
setLoader(true)
    try{
      await deleteRequest(`/categories/${cat_id}`)
      toast.success("Category Deleted Successfully")
fetch_serviceCategories()
    }
catch{
toast.error('Failed to delete this category')

}
finally{
  setLoader(false)
}
  }

  const addNew_Category=async(e:React.FormEvent)=>{
    e.preventDefault()
setLoader(true)

const payload={
  name_en:createCategoryPayload.name_en,
  name_cy:createCategoryPayload.name_cy
}

    try{
await postRequest(`/categories`,payload)
toast.success('Service Category Created Successfully')
fetch_serviceCategories()
    }
    catch{
toast.error('Failed to create category,Try again')
    }
finally{
  setLoader(false)
  setAddcategoryOpen(false)
  setCreateCategoryPayload({
    name_cy:"",name_en:""
  })
}

  }


  const getCategory_byid=async(id:any)=>{
    setEditcategoryOpen(true)

    try{

      const res=await getRequest(`/categories/${id}`)
      console.log(res)
      setEditcategoryOpen(true);
    }
catch{

}
  }

  const edit_category=async(e:React.FormEvent,id:any)=>{
console.log('called')
    e.preventDefault()
    const payload={}
    try{
await postRequest(`/categories/${id}`,payload)
    }
    catch{

    }
    finally{

    }
  }

    const columns: GridColDef[] = [
      {field:"name_en",headerName:"Category",width: 230, },
      {field:"Actions",headerName:"Actions",width:200,renderCell:(params)=> {


        return(
        
   <div>
           <Button
      id="demo-positioned-button"
      aria-controls={open ? 'demo-positioned-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={(e) => handleClick(e, params.row.id)}
    >
      <EllipsisIcon  />
    </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
               PaperProps={{ sx: { boxShadow: '0.3px 1px 3px rgba(0,0,0,0.1)',borderRadius: '10px', }, }}
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
             
              <MenuItem className='flex gap-3 '><FilePen className='w-4 h-4 text-[var(--color-purple)]'
               onClick={()=>{
                
              setSelectedRowid(params.row.id)
getCategory_byid(params.row.id)
              }} 
                /> <Typography > Edit</Typography></MenuItem>
              <MenuItem  onClick={()=>{
delete_category(selectedrowid)
              }}
               className='flex gap-3'><Trash2 className='w-4 h-4 text-red-500' /> <Typography> Delete</Typography></MenuItem>

            </Menu>
          </div>
          )

      },}
      

    ]

  return (
    <>
    <div className='flex flex-col gap-10'>
            <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><HandPlatter className='w-6 h-6' /> Service Categories</h1>
            <div className='flex gap-3 md:flex-row flex-col flex-wrap w-full justify-between'>
          <TextField label="Search Categories"  sx={{ ...themes.textFieldStyle, width: {md:"80%",xs:"100%",lg:"100%"} }} />

          <Button onClick={()=>setAddcategoryOpen(true)} sx={{...themes.ButtonStyle,padding:2,fontSize:"15px",width:{md:"max-content",xs:"100%"}}} className='flex gap-2'><PlusCircle/> Create Service Category</Button>
            </div>

 <div>
          <Card className='md:w-full w-[100%] h-141'>

<DataGrid 
columns={columns}
rows={skillCat}
loading={loader}
 className='rounded border-0'
  sx={{border:"none"}}
    pageSizeOptions={[5, 10, 15]}

/>
            </Card>


</div>


            </div>


{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ➕➕create a category <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
 <div>
      <Modal
        className='flex justify-center items-center'
        open={addcategoryOpen}
        onClose={()=>setAddcategoryOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                 <Card className='md:w-[40%] w-[95%]  p-7 overflow-y-auto'>
                     <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><Plus/> Add New Category</span>  </h2>

          <form className="flex flex-col gap-5" onSubmit={addNew_Category}>
                <div className="flex flex-col gap-2">
                            <label htmlFor="category_id" className="text-sm font-medium">
                              Category Name <span className="text-red-500">*</span>
                            </label>
                           
                          </div>
                          <TextField value={createCategoryPayload.name_en} 
                          label='Name (en)*'
                          onChange={(e)=>setCreateCategoryPayload(prev=>({...prev,name_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                         <TextField value={createCategoryPayload.name_cy} 
                          label='Name (cy)*'
                          onChange={(e)=>setCreateCategoryPayload(prev=>({...prev,name_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />

                          <Button type='submit' sx={{...themes.ButtonStyle}} disabled={loader}>{loader? "Loading...":"Submit"}</Button>

          </form>
        </Card>
      </Modal>
    </div>

{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ➕➕create a category <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}



{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ✏️✏️ edit a category <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}

<div>
      <Modal
        className='flex justify-center items-center'
        open={editcategoryOpen}
        onClose={()=>setEditcategoryOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                 <Card className='md:w-[40%] w-[95%]  p-7 overflow-y-auto'>
                     <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><Plus/> Add New Category</span>  </h2>

          <form className="flex flex-col gap-5" onSubmit={(e)=> edit_category(e,selectedrowid)}>
                <div className="flex flex-col gap-2">
                            <label htmlFor="category_id" className="text-sm font-medium">
                              Category Name <span className="text-red-500">*</span>
                            </label>
                           
                          </div>
                          <TextField value={EditCategoryPayload.name_en} 
                          label='Name (en)*'
                          onChange={(e)=>setEditCategoryPayload(prev=>({...prev,name_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                         <TextField value={EditCategoryPayload.name_cy} 
                          label='Name (cy)*'
                          onChange={(e)=>setEditCategoryPayload(prev=>({...prev,name_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />

                          <Button type='submit' sx={{...themes.ButtonStyle}} disabled={loader}>{loader? "Loading...":"Submit"}</Button>

          </form>
        </Card>
      </Modal>
    </div>

    </>
  )
}

export default ServiceCategory