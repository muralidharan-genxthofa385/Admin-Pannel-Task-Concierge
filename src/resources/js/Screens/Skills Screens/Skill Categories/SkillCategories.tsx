// import HighlightStatsBox from '@/resources/js/Reuseable Components/HighlightStatsBox'
import { getRequest } from '@/Service/Apiservice';
import { themes } from '@/Themes';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Settings2Icon } from 'lucide-react'

import React, { useEffect, useState } from 'react'




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


const SkillCategories:React.FC = () => {


    const [skilllCategories,setSkillCategories]=useState<Category[]>([])


    // const [params,setParams]=useState()

    
    const getAllSkillCat=async()=>{

        try{
            const res=await getRequest(`/skill-categories?page=1&per_page=10&search`)
           
            setSkillCategories(res.data)
 console.log(skilllCategories)
        }
    catch{

    }

    }

    useEffect(()=>{
getAllSkillCat()
    },[])


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
            value={""}
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
        //   onClick={() => setOpenmodal(true)}
          >
            Add +
          </Button>
        </div>




          </div>
    
    </div>
    </>
  )
}

export default SkillCategories