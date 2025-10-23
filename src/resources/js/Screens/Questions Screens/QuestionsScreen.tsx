import { getAllServicess } from '@/Service/Questions_page_service/Questions_page_service'
import { themes } from '@/Themes'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ChevronRight, Plus, SquarePen, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Card } from '@/components/ui/card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
interface servicedata{
  name:string,
  id:number

}

const QuestionsScreen:React.FC = () => {


  const [Servicedata, setServicedata] = useState<servicedata[]>([])
  const [selectedService,setSelectedService]=useState<servicedata|null>(null)
  const [questionType,setQuestionType]=useState<'text'|'radio'|'checkbox'>('text')
  const [radioOptions,setRadioOptions]=useState([''])
  const [openAddradioText,setOpenAddradioText]=useState(false)
    const [openAddCheckboxText,setOpenAddCheckboxText]=useState(false)



  // console.log(questionType)

 const radiostyles = {
        radioLabel: { ...themes.lightFont, color: "var(--color-dark-text)", fontFamily: "Sora, sans-serif", },
        radioButton: { color: "var(--color-grey)", "&.Mui-checked": { color: "var(--color-purple)", fontFamily: "Sora, sans-serif", } },
        checkboxStyle: { color: "var(--color-grey)", "&.Mui-checked": { color: "var(--color-purple)", fontFamily: "Sora, sans-serif", } }
    }
  console.log('selected id :',selectedService)
  useEffect(()=>{
const fetchServices=async()=>{

  try{
    const res=await getAllServicess()
    setServicedata(res.data.items)
console.log('console services',res.data.items)
  }
  catch(err){
console.log('service fetch error',err)
  }
}
fetchServices()
  },[])

const addRadioOption=( )=>{

  // setRadioOptions((prev)=>[...prev,])

}

const addCheckboxOption=( )=>{

setOpenAddCheckboxText(true)
}


  {/**-------------------------------------------------------- Main function return ----------------------------------------------------- */}
  return (
    <>
<div className='flex flex-col gap-10 '>
  <div><h1 className='sm:text-4xl md:text-4xl flex items-center gap-3'><SquarePen className='w-8 h-8'/> Questions Creation</h1>


</div>

  <div></div>{/**----Questions display */}



<Card className='flex flex-col gap-10 shadow rounded-2xl p-6'>

  <div className='flex flex-col gap-3'>
    <h1 className='text-2xl flex gap-1 items-center'>1<ChevronRight className='text-[var(--color-purple)]'/>Select a service to Create a Question</h1>

  <Autocomplete
options={Servicedata}
 getOptionLabel={(option) => option.name}
 value={selectedService}
            onChange={(_event, newValue) => setSelectedService(newValue)}
renderInput={(params)=>(
  <>
  <TextField {...params} sx={themes.textFieldStyle} label="Select a service to Create a Question" />
  </>
)}
  />

</div>
<div>
   <h1 className='text-2xl flex gap-1 items-center'>2<ChevronRight className='text-[var(--color-purple)]'/> Create your Question</h1>
   <TextField  label="" sx={{...themes.inputFeildActions.active}} inputProps={{sx:{pl:4}}}  InputLabelProps={{ sx: themes.inputFeildActions.inActive}} variant="standard" fullWidth />

</div>

<div>
    <h1 className='text-2xl flex gap-1 items-center'>3<ChevronRight className='text-[var(--color-purple)]'/> Select your Question Type</h1>
     <FormControl
     onChange={(e) =>
      setQuestionType(e.target.value as 'text' | 'radio' | 'checkbox')
    }
     >
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={questionType} >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="text" control={<Radio sx={{...radiostyles.radioButton}} />} label="Text" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="radio" control={<Radio sx={{...radiostyles.radioButton}} />} label="Radio" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="checkbox" control={<Radio sx={{...radiostyles.radioButton}} />} label="Checkbox" />
      </RadioGroup>
    </FormControl>
    
</div>
 
  {questionType!=="text"&&<div>
        <h1 className='text-2xl flex gap-1 items-center'>4<ChevronRight className='text-[var(--color-purple)]'/> Create your Question's Options</h1>

 {questionType=='radio'? <div className='flex flex-col'>

  <FormControl
     onChange={(e) =>
      setQuestionType(e.target.value as 'text' | 'radio' | 'checkbox')
    }
     >
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={questionType} >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="text" control={<Radio sx={{...radiostyles.radioButton}} />} label="Text" />
       
      </RadioGroup>
    </FormControl>
    <Button sx={{...themes.OutlinedButtonStyle,mt:2}}>+ Add Option</Button>
 
 </div>
:questionType=='checkbox' ?<div>

<FormGroup sx={{display:"flex"}}>
  <FormControlLabel control={<Checkbox sx={radiostyles.checkboxStyle} />} label={<div className='flex gap-2'>
 Label <Trash2 className='w-4 text-red-500' onClick={()=>alert('hai')}/>
  </div>} />
  </FormGroup>

      <div>
        <Button  sx={{...themes.OutlinedButtonStyle,mt:2,width:"100%"}} onClick={addCheckboxOption}><Plus/> Add Option</Button>
        
      </div>

</div> :
<>
</>
}
</div>}

<div className='flex flex-col gap-3'>
 <h1 className='text-2xl flex gap-1 items-center'>{questionType=="text"?4:5}<ChevronRight className='text-[var(--color-purple)]'/> Is your Question is Madnatory and to be filled ?</h1>
    <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={questionType} >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="yes" control={<Radio sx={{...radiostyles.radioButton}} />} label="Yes" />
                <FormControlLabel sx={{...radiostyles.radioLabel}} value="no" control={<Radio sx={{...radiostyles.radioButton}} />} label="No" />
      </RadioGroup>
</div>


</Card>


</div>
    </>
  )
}

export default QuestionsScreen