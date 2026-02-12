// import HighlightStatsBox from '@/resources/js/Reuseable Components/HighlightStatsBox'
import { Card } from '@/components/ui/card';
import { deleteRequest, getRequest, postRequest, PutRequest } from '@/Service/Apiservice';
import { themes } from '@/Themes';
import { Box, Button, FormControl, InputLabel, Menu, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { EditIcon, Ellipsis, PencilIcon, Plus, Settings2Icon, X } from 'lucide-react'

import React, { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'react-toastify';




export interface Category {

    items:{
 id: number;
  name_en: string;
  name_cy: string;
  description_en: string;
  description_cy: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;    
  updated_at: string;  
    }[]
   
}
interface catToedit{
  name_en: string,
                name_cy: string,
        description_en: string,
                description_cy: string,
                  is_active:boolean|null

}


const SkillCategories:React.FC = () => {


    const [skilllCategories,setSkillCategories]=useState<Category[]>([])
    const [selectedRowID,setSelectedRowID]=useState(0)
    const [loader,setLoader]=useState(false)
    const [addskillcatopen,setAddskillcatopen]=useState(false)
    const [editcatOpen,setEditCatOpen]=useState(false)

    const [createNewCatPayload,setCreateNewCatPayload]=useState({
       id:null,
      name_en:"",
      name_cy:"",
      description_en:"",
      description_cy:"",
      isActive:true
    })

    const [categoryToEdit,setCategoryToEdit]=useState<catToedit>({
      name_en:"",
      name_cy:"",
      description_en:"",
      description_cy:"",
      is_active:null

    })

    const [params,setParams]=useState({
      search:""
    })


     const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
                const open = Boolean(anchorEl);
                const handleClick = (event: React.MouseEvent<HTMLButtonElement>,rowId:number) => {
                  setAnchorEl(event.currentTarget);
                  setSelectedRowID(rowId)
                };
                const handleClose = () => {
                  setAnchorEl(null);
                };


    // const [params,setParams]=useState()

    
    const getAllSkillCat=async()=>{

        try{
            const res=await getRequest(`/skill-categories?${params.search}`)
           
            setSkillCategories(res.data.items)
 console.log(skilllCategories)
        }
    catch{

    }

    }

    useEffect(()=>{
getAllSkillCat()
    },[params])

    const getCatBYID=async()=>{

      try{
const res=await getRequest(`/skill-categories/${selectedRowID}`)
console.log(res)
const response=res?.data
setCategoryToEdit({
  name_en:response?.name_en,
  name_cy:response.name_cy,
  description_cy:response.description_cy,
  description_en:response.description_en,
  is_active:response.is_active

})

      }
      catch{

      }

    }


    const CreateNewCategory=async(e:FormEvent)=>{
      e.preventDefault()
      setLoader(true)
const payload={
  name_en:createNewCatPayload.name_en,
  name_cy:createNewCatPayload.name_cy,
  description_en:createNewCatPayload.description_en,
  description_cy:createNewCatPayload.description_cy

}
      try{
await postRequest(`/skill-categories`,payload)
setAddskillcatopen(false)
getAllSkillCat()
toast.success('Category added successfully')

      }
      catch{
        toast.error('failed to add category ,please try again')
      }
      finally{
        setLoader(false)
      }

    }

    const deleteCategory=(Rowid:number)=>{

      setLoader(true)

      deleteRequest(`/skill-categories/${Rowid}`)
      .then(()=>{
        toast.success('Category deleted successfully') 
        getAllSkillCat()

      })
      .catch(()=>{
        toast.error('Failed to delete category,please try again')
      })
      .finally(()=>{
        setLoader(false)
      })

    }

    useEffect(()=>{
getCatBYID()
    },[editcatOpen])
 

    const editSkillCategory=(e:FormEvent)=>{
      e.preventDefault()
      setLoader(true)

      PutRequest(`/skill-categories/${selectedRowID}`,categoryToEdit)
      .then(()=>{
        toast.success('Category edited Successfully')
        setEditCatOpen(false)
      })
      .catch(()=>{
        toast.error('Failed to edit this category')
      })
      .finally(()=>{
        setLoader(false)
      })

      

    }



    const columns:GridColDef[]=[
      {field:"name_en",width:250,headerName:"Name"},
      {field:"description_en",width:500,headerName:"Description"},
      {field:"is_active",width:150,headerName:"Status",renderCell:(params)=>{
        return(<>
        <Box sx={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Typography sx={{width:"80%",backgroundColor:params.row.is_active?"var(--color-green)":"var(--color-red)"
            ,color:"white",
            textAlign:"center",p:1,borderRadius:"10px"
          }} >{params.row.is_active?"Active":"Inactive"}</Typography>
        </Box>
        </>)
      }},
      {
  field: "actions",
  headerName: "Actions",
  width: 200,
  renderCell: (params) => {         
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(e) => {
            handleClick(e, params.row.id);
          }}
        >
          <Ellipsis style={{ color: "var(--color-purple)" }} />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              boxShadow: '0.3px 1px 3px rgba(0,0,0,0.1)',
              borderRadius: '10px',
            }
          }}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}
        >
          <MenuItem onClick={() => {setEditCatOpen(true),handleClose()}} className='flex gap-2'>
            <EditIcon className='text-[var(--color-purple)]' /> Edit
          </MenuItem>
          <MenuItem onClick={() => {
            deleteCategory(selectedRowID)
          }} className='flex gap-2'>
            <X className='text-[var(--color-red)]' /> Delete
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
    ]



  return (
    <>
    <div className='flex flex-col gap-10'>
    <h2 className='sm:text-2xl md:text-2xl flex items-center gap-3'><Settings2Icon/> Skill Categories</h2>
    
          <div className=' flex flex-col gap-10'>
{/* <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-0'>
    <HighlightStatsBox icon={GraduationCap} color='var(--color-grey)' title='Skilled' count={10}  />
        <HighlightStatsBox icon={Wrench} color='var(--color-grey)' title='Unskilled' count={10}  />
    <HighlightStatsBox icon={ToolCase} color='var(--color-grey)' title='Business & Events' count={10}  />
</div> */}

 <div className='flex flex-col gap-5 md:flex-row w-[100%]'>
          <TextField
            label="Search By Name"
            className="md:w-3/4 w-[100%]"
            value={params.search}
            onChange={(e)=>{setParams(prev=>({...prev,search:e.target.value}))}}
            variant="outlined"
            sx={themes.textFieldStyle}
          />

<FormControl className="md:w-1/4 w-[100%]" sx={themes.textFieldStyle}>
  <InputLabel>Search By Category</InputLabel>
  <Select
    value={ ""}
    label="Search By Category"
   

  >
  
      <MenuItem>
        Plumbing
      </MenuItem>
  
  </Select>
</FormControl>

          <Button className='md:w-[10%]' size='small'  sx={{ ...themes.OutlinedButtonStyle }} 
        onClick={()=>{setAddskillcatopen(true)}}
          >
            Add +
          </Button>
        </div>

<Card className='md:w-full  h-131 rounded-2xl'>
<DataGrid
  rows={skilllCategories??[]}
  columns={columns}
  paginationMode="server"
  // paginationModel={PaginationModel}
  // onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
  pageSizeOptions={[5, 10, 15]}
// rowCount={totalCount}
//   loading={loading}
  // getRowId={(row) => row.id || `${row.email}-${row.phone}`}  
  sx={{ border: 0, width: "100%" }}
/>
</Card>



          </div>
    
    </div>

{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Add Skill Category <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}

 <div>
      <Modal
        className='flex justify-center items-center'
        open={addskillcatopen}
        onClose={()=>setAddskillcatopen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                 <Card className='md:w-[40%] w-[95%]  p-7 overflow-y-auto'>
                     <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><Plus/> Add New Skill Category</span>  </h2>

          <form className="flex flex-col gap-5" onSubmit={CreateNewCategory}>
                          <TextField value={createNewCatPayload.name_en} 
                          label='Name (Eng)'
                          onChange={(e)=>setCreateNewCatPayload(prev=>({...prev,name_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                           <TextField value={createNewCatPayload.name_cy} 
                          label='Name (Welsh)'
                          onChange={(e)=>setCreateNewCatPayload(prev=>({...prev,name_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={createNewCatPayload.description_en} 
                           label='Description (Eng)'
                          onChange={(e)=>setCreateNewCatPayload(prev=>({...prev,description_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={createNewCatPayload.description_cy} 
                           label='Description (Welsh)'
                          onChange={(e)=>setCreateNewCatPayload(prev=>({...prev,description_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />

                          <Button type='submit' sx={{...themes.ButtonStyle}} disabled={loader}>{loader? "Loading...":"Submit"}</Button>

          </form>
        </Card>
      </Modal>
    </div>

{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Add Skill Category <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}



{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skills EDIT popup<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}

<div>
      <Modal
        className='flex justify-center items-center'
        open={editcatOpen}
        onClose={()=>setEditCatOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                 <Card className='md:w-[40%] w-[95%]  p-7 overflow-y-auto'>
                     <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><PencilIcon/> Edit Skill Category</span>  </h2>

          <form className="flex flex-col gap-5" onSubmit={editSkillCategory}>
                <div className="flex flex-col gap-2">
                          </div>
                          <TextField value={`${categoryToEdit.name_en}`} 
                          label='Name (eng)'
                          onChange={(e)=>setCategoryToEdit(prev=>({...prev,name_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={categoryToEdit.name_cy} 
                          label='Name (Welsh)'
                          onChange={(e)=>setCategoryToEdit(prev=>({...prev,name_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={categoryToEdit.description_en} 
                           label='Description (Eng)'
                           multiline
                           maxRows={3}
                          onChange={(e)=>setCategoryToEdit(prev=>({...prev,description_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={categoryToEdit.description_cy} 
                           label='Description (Welsh)'
                           multiline
                           maxRows={3}
                          onChange={(e)=>setCategoryToEdit(prev=>({...prev,description_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <FormControl sx={themes.textFieldStyle}>
                            <InputLabel id="status-label">Status</InputLabel>
                          <Select
                          value={categoryToEdit.is_active??""}
                          onChange={(e)=>{
                            const value=e.target.value
                            setCategoryToEdit((prev)=>({...prev,is_active:value === "true" ? true : value === "false" ? false : null,}))
                          }}
                          sx={themes.textFieldStyle} label='Status'>
                           <MenuItem value="true">Active</MenuItem>
                           <MenuItem value="false">Inactive</MenuItem>

                          </Select>
</FormControl>
                          <Button type='submit' sx={{...themes.ButtonStyle}} disabled={loader}>{loader? "Loading...":"Edit"}</Button>

          </form>
        </Card>
      </Modal>
    </div>

{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skills EDIT popup<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}


    </>
  )
}

export default SkillCategories