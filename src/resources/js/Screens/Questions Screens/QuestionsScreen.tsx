import { getAllServicess } from '@/Service/Questions_page_service/Questions_page_service'
import { themes } from '@/Themes'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ChevronRight, SquarePen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Card } from '@/components/ui/card'
interface servicedata{
  name:string,
  id:number

}

const QuestionsScreen:React.FC = () => {


  const [Servicedata, setServicedata] = useState<servicedata[]>([])
  const [selectedService,setSelectedService]=useState<servicedata|null>(null)
  const [questionType,setQuestionType]=useState<'text'|'radio'|'checkbox'>('text')

 const radiostyles = {
        radioLabel: { ...themes.lightFont, color: "var(--color-dark-text)" },
        radioButton: { color: "var(--color-grey)", "&.Mui-checked": { color: "var(--color-purple)" } },
        checkboxStyle: { color: "var(--color-grey)", "&.Mui-checked": { color: "var(--color-purple)", } }
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
     <FormControl>
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={questionType} >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="text" control={<Radio sx={{...radiostyles.radioButton}} />} label="Text" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="radio" control={<Radio sx={{...radiostyles.radioButton}} />} label="Radio" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="checkbox" control={<Radio sx={{...radiostyles.radioButton}} />} label="Checkbox" />
      </RadioGroup>
    </FormControl>


</div>

</Card>


</div>
    </>
  )
}

export default QuestionsScreen