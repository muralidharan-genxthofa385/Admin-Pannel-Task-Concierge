import { themes } from '@/Themes';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Brain,EditIcon, Ellipsis,GraduationCap, PencilIcon, Plus, ToolCase, Wrench, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import { deleteRequest, getRequest, postRequest, PutRequest } from '@/Service/Apiservice';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import { Card } from '@/components/ui/card';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';


interface skillprop{
    id:number,
    skill_category_id:number,
    name:{
      en:string,cy:string
    },
    description:string
            is_active:boolean

    skill_category:{
        id:number
        name:string
        description:string
    }

}
interface createPAyloadType{
  id:number|null,
  name_en:string,
  name_cy:string,
  description_en:string
  description_cy:string

}
interface SkillCategories{
name:{en:string},
id:number
}
interface skilltoEdit{
  id: number|null,
  is_active:boolean|null
        skill_category_id: number|null,
        name_en: string,
                name_cy: string,
        description_en: string,
                description_cy: string,
        skill_category:{name:string}
}

const SkillsTable:React.FC = () => {


 

    const [params,setParams]=useState({
        page:1,
        per_page:10,
        search:"",
        skill_category_id:'',
    })

   const [selectedrowid,setSelectedRowid]=useState<number|null>(null)
   const [PaginationModel,setPaginationModel]=useState<{page:number,pageSize:number}>({page:1,pageSize:10})
   const [skilldatas,setSkilldatas]=useState<skillprop[]>([])
   const [loading,setLoading]=useState(false)
   const [skillCategories,setSkillCategories]=useState<SkillCategories[]>([])
    const [Addskillopen, setAddskillopen] = React.useState(false);
    const [addskillLoader,setAddskillLoader]=useState(false)
    const [editSkillOpen,setEditSkillOpen]=useState(false)
    const [totalCount, setTotalCount] = useState(0);
      const [skillToEdit,setSkilltoEdit]=useState<skilltoEdit>({ id:null, skill_category_id: null,name_en: "",name_cy: "", description_en: "",description_cy:"",is_active:null,skill_category:{name:""}})
    const [createSkillPayload,setCreateskillPayload]=useState<createPAyloadType>({
      id:null,
      name_en:"",
      name_cy:"",
      description_en:"",
      description_cy:""

    })
    console.log(createSkillPayload)
           const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
            const open = Boolean(anchorEl);
            const handleClick = (event: React.MouseEvent<HTMLButtonElement>,rowId:number) => {
              setAnchorEl(event.currentTarget);
              setSelectedRowid(rowId)
            };
            const handleClose = () => {
              setAnchorEl(null);
            };

        const get_SkillCategories=async()=>{

          try{
            const res=await getRequest(`/skills/categories`)
            console.log("skill category",res)
            setSkillCategories(res.data)
          }
          catch{}
        } 

        const getSkill_by_id=async()=>{
          try{
            const res=await getRequest(`/skills/${selectedrowid}`)
            const response=res.data
          setSkilltoEdit({
            id:response.id,
          skill_category_id:response.skill_category_id,
          name_en:response.name_en,
          name_cy:response.name_cy,
          description_cy:response.description_cy,
          description_en:response.description_en,
          is_active:response.is_active,
          skill_category:{name:response.skill_category.name}
          })
            console.log("individual skill",skillToEdit)
          }
          catch{

          }
        }
        useEffect(()=>{
get_SkillCategories()
        },[])   

    const fetchallSkills=async()=>{
        setLoading(true)

        try{
            const res=await getRequest(`/skills?page=${params.page}&per_page=${params.per_page}&search=${params.search}&skill_category_id=${params.skill_category_id}`)
            console.log(res)
            setSkilldatas(res.data.items)
            setTotalCount(res.data.pagination.total);
        }
        catch(err){

        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchallSkills()
    },[params])
 useEffect(()=>{
setParams(prev=>({...prev,page:PaginationModel.page+1,per_page:PaginationModel.pageSize}))
  },[PaginationModel])


  const PostNewSkill=(e:React.FormEvent)=>{
    setAddskillLoader(true)
    e.preventDefault()
    const payload={
      skill_category_id:createSkillPayload.id,
      name_en:createSkillPayload.name_en,
      name_cy:createSkillPayload.name_cy,
      description_en:createSkillPayload.description_en,
      description_cy:createSkillPayload.description_cy

    }
    postRequest(`/skills`,payload)
    .then(()=>toast.success('Skill Added Successfully'))
    .catch((err)=>{console.log(err)})
    .finally(()=>{setAddskillLoader(false)
      setAddskillopen(false)
      setCreateskillPayload(()=>({
       id:null,
      name_en:"",
      name_cy:"",
      description_en:"",
      description_cy:""
      }))
    })
  }

  const Edit_Skill=(e:React.FormEvent)=>{
 e.preventDefault()
 const payload={
        skill_category_id:skillToEdit.skill_category_id,
      name:skillToEdit.name_en,
      description:skillToEdit.description_cy,
      is_active:skillToEdit.is_active
 }
 PutRequest(`/skills/${skillToEdit.id}`,payload)
 .then(()=>{
  toast.success('Skill Edited Successfully')
  fetchallSkills()
 })
 .catch(()=>{
  toast.error('Unable to Edit this Skill,Try again')
 })
 .finally(()=>{
setEditSkillOpen(false)
  // setSkilltoEdit({ id:null, skill_category_id: null,name: "", description: "",skill_category:{name:""}})
 })
  }

  const deleteSkill=()=>{
deleteRequest(`/skills/${selectedrowid}`)
.then(()=>{
  toast.success('Skill Removed Successfully')
fetchallSkills()
})
.catch(()=>toast('Unable to Remove Skill'))

  }
    
         const columns: GridColDef[]=[
              { field: 'skill_category', headerName: 'Category Name', width: 300,renderCell:(p)=>(<>{p.row.skill_category.name_en}</>) },
             { field: 'name', headerName: 'Skill', width: 290,renderCell:(p)=>(<>{p.row.name_en}</>) },
        { field: 'description', headerName: 'Description', width: 480,renderCell:(p)=>(<>{p.row.description_en}</>)},
        {field:'is_active',headerName:'Status',width:250,renderCell:(p)=>(
        <Box sx={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Typography 
             className={`${p.row.is_active==false?'bg-amber-500':"bg-green-600"} p-2 rounded-3xl text-white w-[80%] flex justify-center`} 
            sx={{display:"flex",alignItems:"center"}}>
            {p.row.is_active==true?"Active":"Inactive"}</Typography>
             </Box>)},
    
    
    { field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell:(d)=>(
     <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e)=>{handleClick(e,d.row.id);setSelectedRowid(d.row.id)}}
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
            
          <MenuItem onClick={()=>{setEditSkillOpen(true);setSelectedRowid(d.row.id);getSkill_by_id();handleClose()}} className='flex gap-2'><EditIcon className='text-[var(--color-purple)]' /> Edit</MenuItem>
            <MenuItem onClick={()=>{deleteSkill();handleClose();}} className='flex gap-2'><X className='text-[var(--color-red)]' /> Delete</MenuItem>
          </Menu>
        </div>
      )
    }
]





  return (
     <>
    <div className='flex flex-col gap-10'>
<h2 className='sm:text-2xl md:text-2xl flex items-center gap-3'><Brain/> Skills</h2>

      <div className=' flex flex-col gap-10'>

<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-0'>
    <HighlightStatsBox icon={GraduationCap} color='var(--color-grey)' title='Skilled' count={10}  />
        <HighlightStatsBox icon={Wrench} color='var(--color-grey)' title='Unskilled' count={10}  />
    <HighlightStatsBox icon={ToolCase} color='var(--color-grey)' title='Business & Events' count={10}  />


</div>

 <div className='flex flex-col gap-5 md:flex-row w-[100%]'>
          <TextField
            label="Search By Name"
            className="md:w-3/4 w-[100%]"
            value={params.search}
            onChange={(e) => setParams(prev => ({ ...prev, search: e.target.value, page: 0 }))}
            variant="outlined"
            sx={themes.textFieldStyle}
          />

<FormControl className="md:w-1/4 w-[100%]" sx={themes.textFieldStyle}>
  <InputLabel>Search By Category</InputLabel>
  <Select
    value={params.skill_category_id || ""}
    label="Search By Category"
    onChange={(e) => {
      const selectedId = e.target.value;
      setParams(prev => ({
        ...prev,
        skill_category_id: selectedId,
        page: 0,
      }));
    }}
    IconComponent={() => {
      const hasValue = !!params.skill_category_id;
      if (hasValue) {
        return (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation(); 
              setParams(prev => ({
                ...prev,
                skill_category_id: "",
                page: 0,
              }));
            }}
            aria-label="Clear selection"
          >
            <X fontSize="small" />
          </IconButton>
        );
      }
    
    }}
  >
    {skilldatas.map((d) => (
      <MenuItem key={d.skill_category_id} value={d.skill_category_id}>
        {d.skill_category.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

          <Button className='md:w-[10%]' size='small' onClick={()=>setAddskillopen(true)} sx={{ ...themes.OutlinedButtonStyle }} 
        //   onClick={() => setOpenmodal(true)}
          >
            Add +
          </Button>
        </div>
<Card className='md:w-full  h-131 rounded-2xl'>
<DataGrid
  rows={skilldatas??[]}
  columns={columns}
  paginationMode="server"
  paginationModel={PaginationModel}
  onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
  pageSizeOptions={[5, 10, 15]}
rowCount={totalCount}
  loading={loading}
  getRowId={(row) => row.id || `${row.email}-${row.phone}`}  
  sx={{ border: 0, width: "100%" }}
/>
</Card>


        </div>

    </div>

{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skills add popup<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
 <div>
      <Modal
        className='flex justify-center items-center'
        open={Addskillopen}
        onClose={()=>setAddskillopen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                 <Card className='md:w-[40%] w-[95%]  p-7 overflow-y-auto'>
                     <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><Plus/> Add New Skill</span>  </h2>

          <form className="flex flex-col gap-5" onSubmit={PostNewSkill}>
                <div className="flex flex-col gap-2">
                            <label htmlFor="category_id" className="text-sm font-medium">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <FormControl sx={themes.textFieldStyle}>
                              <InputLabel>Select a category</InputLabel>
                              <Select id="category_id" name="category_id" label="Select a category" sx={themes.textFieldStyle}
                               value={createSkillPayload.id}
                                onChange={(e)=>setCreateskillPayload((prev)=>({...prev,id:Number(e.target.value)}))}
                              >
                                {skillCategories.map((data)=>
                                  <MenuItem value={data.id}
                                  onClick={()=>setCreateskillPayload((prev)=>({...prev,id:data.id}))}
                                  >{data.name.en}</MenuItem>)}
                                
                              </Select>
                            </FormControl>
                          </div>
                          <TextField value={createSkillPayload.name_en} 
                          label='Name (Eng)'
                          onChange={(e)=>setCreateskillPayload(prev=>({...prev,name_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                           <TextField value={createSkillPayload.name_cy} 
                          label='Name (Welsh)'
                          onChange={(e)=>setCreateskillPayload(prev=>({...prev,name_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={createSkillPayload.description_en} 
                           label='Description (Eng)'
                          onChange={(e)=>setCreateskillPayload(prev=>({...prev,description_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={createSkillPayload.description_cy} 
                           label='Description (Welsh)'
                          onChange={(e)=>setCreateskillPayload(prev=>({...prev,description_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />

                          <Button type='submit' sx={{...themes.ButtonStyle}} disabled={addskillLoader}>{addskillLoader? "Loading...":"Submit"}</Button>

          </form>
        </Card>
      </Modal>
    </div>
    {/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skills add popup<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}


{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skills EDIT popup<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}

<div>
      <Modal
        className='flex justify-center items-center'
        open={editSkillOpen}
        onClose={()=>setEditSkillOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                 <Card className='md:w-[40%] w-[95%]  p-7 overflow-y-auto'>
                     <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><PencilIcon/> Edit Skill</span>  </h2>

          <form className="flex flex-col gap-5" onSubmit={Edit_Skill}>
                <div className="flex flex-col gap-2">
                            <label htmlFor="category_id" className="text-sm font-medium">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <FormControl sx={themes.textFieldStyle}>
                              <Select id="category_id" name="category_id" sx={themes.textFieldStyle}
                             value={skillToEdit.skill_category_id || ""}  
  onChange={(e) => setSkilltoEdit(prev => ({
    ...prev,
    skill_category_id: Number(e.target.value)
  }))}
                              >
                                {skillCategories.map((data)=>
                                  <MenuItem value={data.id}
                                  onClick={()=>setCreateskillPayload((prev)=>({...prev,id:data.id}))}
                                  >{data.name.en}</MenuItem>)}
                                
                              </Select>
                            </FormControl>
                          </div>
                          <TextField value={`${skillToEdit.name_en}`} 
                          label='Name (eng)'
                          onChange={(e)=>setSkilltoEdit(prev=>({...prev,name_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={skillToEdit.name_cy} 
                          label='Name (Welsh)'
                          onChange={(e)=>setSkilltoEdit(prev=>({...prev,name_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={skillToEdit.description_en} 
                           label='Description (Eng)'
                           multiline
                           maxRows={3}
                          onChange={(e)=>setSkilltoEdit(prev=>({...prev,description_en:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <TextField value={skillToEdit.description_cy} 
                           label='Description (Welsh)'
                           multiline
                           maxRows={3}
                          onChange={(e)=>setSkilltoEdit(prev=>({...prev,description_cy:e.target.value}))}
                          sx={themes.textFieldStyle}
                          />
                          <FormControl sx={themes.textFieldStyle}>
                            <InputLabel id="status-label">Status</InputLabel>
                          <Select
                          value={skillToEdit.is_active??""}
                          onChange={(e)=>{
                            const value=e.target.value
                            setSkilltoEdit((prev)=>({...prev,is_active:value === "true" ? true : value === "false" ? false : null,}))
                          }}
                          sx={themes.textFieldStyle} label='Status'>
                           <MenuItem value="true">Active</MenuItem>
                           <MenuItem value="false">Inactive</MenuItem>

                          </Select>
</FormControl>
                          <Button type='submit' sx={{...themes.ButtonStyle}} disabled={addskillLoader}>{addskillLoader? "Loading...":"Edit"}</Button>

          </form>
        </Card>
      </Modal>
    </div>

{/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Skills EDIT popup<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}



   </>
  )
}

export default SkillsTable