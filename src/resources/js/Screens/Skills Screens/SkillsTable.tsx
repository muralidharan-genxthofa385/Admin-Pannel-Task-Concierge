import { themes } from '@/Themes';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Brain,EditIcon, Ellipsis, EyeIcon, GraduationCap, ToolCase, Wrench, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox';
import { getRequest } from '@/Service/Apiservice';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import { Card } from '@/components/ui/card';
import IconButton from '@mui/material/IconButton';

interface skillprop{
    id:number,
    skill_category_id:number,
    name:string,
            is_active:boolean

    skill_category:{
        id:number
        name:string
        description:string
    }

}



const SkillsTable:React.FC = () => {


 

    const [params,setParams]=useState({
        page:1,
        per_page:10,
        search:"",
        skill_category_id:'',
    })

   const [_selectedrowid,setSelectedRowid]=useState<number|null>(null)
   const [PaginationModel,setPaginationModel]=useState<{page:number,pageSize:number}>({page:1,pageSize:10})
   const [skilldatas,setSkilldatas]=useState<skillprop[]>([])
   const [loading,setLoading]=useState(false)
    
           const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
            const open = Boolean(anchorEl);
            const handleClick = (event: React.MouseEvent<HTMLButtonElement>,rowId:number) => {
              setAnchorEl(event.currentTarget);
              setSelectedRowid(rowId)
            };
            const handleClose = () => {
              setAnchorEl(null);
            };
          
    
    const fetchallSkills=async()=>{
        setLoading(true)

        try{
            const res=await getRequest(`/skills?page=${params.page}&per_page=${params.per_page}&search=${params.search}&skill_category_id=${params.skill_category_id}`)
            console.log(res)
            setSkilldatas(res.data.items)
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

    
         const columns: GridColDef[]=[
              { field: 'skill_category', headerName: 'Category Name', width: 300,renderCell:(p)=>(<>{p.row.skill_category.name}</>) },
             { field: 'name', headerName: 'Skill', width: 290,renderCell:(p)=>(<>{p.row.name}</>) },
        { field: 'description', headerName: 'Description', width: 480,renderCell:(p)=>(<>{p.row.skill_category.description}</>)},
        {field:'is_active',headerName:'Status',width:250,renderCell:(p)=>(
        <Box sx={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Typography 
             className={`${p.row.is_active==false?'bg-amber-500':"bg-green-600"} p-2 rounded-3xl text-white w-[80%] flex justify-center`} 
            sx={{display:"flex",alignItems:"center"}}>
            {p.row.skill_category.is_active?"Active":"Inactive"}</Typography>
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
            
     <MenuItem onClick={()=>{;handleClose()}} className='flex gap-2'><EyeIcon className='text-[var(--color-purple)]' /> View</MenuItem>
          <MenuItem onClick={()=>{;handleClose()}} className='flex gap-2'><EditIcon className='text-[var(--color-purple)]' /> Edit</MenuItem>
            <MenuItem onClick={()=>{;handleClose();}} className='flex gap-2'><X className='text-[var(--color-red)]' /> Delete</MenuItem>
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

<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6'>
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

          <Button className='md:w-[10%]' size='small' sx={{ ...themes.OutlinedButtonStyle }} 
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
//   rowCount={totalCount}
  loading={loading}
  getRowId={(row) => row.id || `${row.email}-${row.phone}`}  
  sx={{ border: 0, width: "100%" }}
/>
</Card>


        </div>

    </div>
   </>
  )
}

export default SkillsTable