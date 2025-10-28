import { deleteQuestionbyId, getAllServicess, getQuestionByServiceID, PostQuestion } from '@/Service/Questions_page_service/Questions_page_service'
import { themes } from '@/Themes'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Card } from '@/components/ui/card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
interface servicedata{
  name:string,
  id:number

}

interface questions {
  id: number
  input_type: string,
  options_json: string[],
  question_text: string,
  service: {
    category: { name: string },
    name: string,
    id: number
  }

}


const QuestionsScreen:React.FC = () => {

  const navigate=useNavigate()

  const [Servicedata, setServicedata] = useState<servicedata[]>([])
  const [selectedService,setSelectedService]=useState<servicedata|null>(null)
  const [question_text,setQuestion_text]=useState('')
  const [questionType,setQuestionType]=useState<'text'|'radio'|'checkbox'>('text')
  const [radioOptions,setRadioOptions]=useState<string[]>([])
  const [radioOptiontext,setradioOptiontext]=useState('')
  const [checkboxOption,setCheckboxOption]=useState<string[]>([])
  const [checkboxOptiontext,setCheckboxOptiontext]=useState('')
  const [is_required,setIsRequired]=useState<boolean|string>('')
  const [displayQuestions,setDisplayQuestions]=useState<questions[]|null>([])



 

 const radiostyles = {
        radioLabel: { ...themes.lightFont, color: "var(--color-dark-text)", fontFamily: "Sora, sans-serif", },
        radioButton: { color: "var(--color-grey)", "&.Mui-checked": { color: "var(--color-purple)", fontFamily: "Sora, sans-serif", } },
        checkboxStyle: { color: "var(--color-grey)", "&.Mui-checked": { color: "var(--color-purple)", fontFamily: "Sora, sans-serif" }, }
    }
  console.log('selected id :',selectedService?.id)
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
 const fetchQuestionsbyId=async()=>{

try{
  const res=await getQuestionByServiceID(Number(selectedService?.id))
setDisplayQuestions(res.data)
console.log("service questions",displayQuestions)
}
catch{

}
  }

useEffect(()=>{
 
  fetchQuestionsbyId()
},[selectedService])


 const radioOnchange=(e:React.ChangeEvent<HTMLInputElement>)=>{ setQuestionType(e.target.value as 'text'|'radio'|'checkbox') }

const addRadioOption=()=>{
if(radioOptiontext!==""){
  setRadioOptions(prev=>[...prev,radioOptiontext])
  setradioOptiontext('')}
}
const deleteRadioOption=(index:any)=>{
  setRadioOptions(prev=>prev.filter((_,i)=>i!==index))
}


const addCheckboxOption=( )=>{
  if(checkboxOptiontext!==""){
    setCheckboxOption(prev=>[...prev,checkboxOptiontext])
  }
  setCheckboxOptiontext('') 
}

const deleteCheckboxOption=(id:number)=>{
  setCheckboxOption(prev=>prev.filter((_,i)=>i!==id))
}



const handleSaveQuestion=async()=>{
if(!question_text){
toast.error('please enter the question text')
}else if(!selectedService){
  toast.error('please select a service to continue')
}else if(!questionType){
    toast.error('please select a Question Type to continue')
}
else if(is_required==''){  toast.error('please select if the question is Required or Not')}
  const payload={
    question_text: question_text,
  input_type: questionType,
  question_type: questionType=="text"?"text":questionType=="radio"?"single_select":"multi_select",
  options_json: 
    questionType=="radio"?radioOptions:questionType=="checkbox"?checkboxOption:null,
  is_required: is_required

  }
  console.log(  ",payload data",payload)

  await PostQuestion(payload,Number(selectedService?.id))
  try{
toast.success('Question Created Successfully')
setQuestion_text('')
setQuestionType('text')
fetchQuestionsbyId()
  }
  catch{
alert('err')
  }

}

  const deleteQuestion = (id: number) => {
    deleteQuestionbyId(id)
      .then(() => {
        toast.success("Question Deleted Success")
        fetchQuestionsbyId()

      })
      .catch(() => toast.error('Failed to delete this question'))
  }


  {/**-------------------------------------------------------- Main function return ----------------------------------------------------- */}
  return (
    <>
<div className='flex flex-col gap-10 '>
  <div><h1 className='sm:text-2xl  md:text-2xl flex items-center gap-3 cursor-pointer w-max' onClick={()=>navigate(-1)}><ChevronLeft className='w-6 h-6'/> Questions Creation</h1></div>

  



<Card className='flex flex-col gap-10 shadow rounded-2xl p-6'>

  <div className='flex flex-col gap-3'>
    <h1 className='text-xl md:text-2xl flex gap-1 items-center'>1<ChevronRight className='text-[var(--color-purple)]'/>Select a service to Create a Question</h1>

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
  {selectedService&&<div>
    {displayQuestions?.length == null ? <Typography>No Questions for this service</Typography> : displayQuestions.map((data, ind) => <div>
                
              <div className='flex w-full border-b-1 py-2 pb-2'> <Typography className='flex w-full items-center gap-3 '> <span className='bg-gray-200 rounded' style={{padding:5}}>Q{ind+1}</span> <span className='text-1xl'>{data.question_text}</span></Typography>
<div className='flex justify-end gap-4 w-[50%]'>
  <Button size='small' sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"30%"}} onClick={()=>navigate(`/questions/edit/${data.id}`)}>Edit <Pencil className='w-4 h-4 ml-2' /></Button>
  <Button size='small' sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"30%"}} onClick={()=>deleteQuestion(data.id)}> Delete <Trash2 className='w-4 h-4 ml-2 text-red-500' /></Button>
</div>
</div>
              </div>)}
    </div>}
    
    {/**----Questions display */}

</div>

<div>
   <h1 className='text-xl md:text-2xl flex gap-1 items-center'>2<ChevronRight className='text-[var(--color-purple)]'/> Create your Question</h1>
   <TextField  label="" sx={{...themes.inputFeildActions.active}}
   value={question_text} onChange={(e)=>setQuestion_text(e.target.value)}
   inputProps={{sx:{pl:4}}}  InputLabelProps={{ sx: themes.inputFeildActions.inActive}} variant="standard" fullWidth />

</div>

<div>
    <h1 className='text-xl md:text-2xl flex gap-1 items-top md:items-center'>3<ChevronRight className='text-[var(--color-purple)]'/> Select your Question Type</h1>
     <FormControl
     onChange={radioOnchange}
     >
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={questionType} >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="text" control={<Radio sx={{...radiostyles.radioButton}} />} label="Text" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="radio" control={<Radio sx={{...radiostyles.radioButton}} />} label="Radio (single-select)" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="checkbox" control={<Radio sx={{...radiostyles.radioButton}} />} label="Checkbox (multiple-select)" />
      </RadioGroup>
    </FormControl>
    
</div>
 
  {questionType!=="text"&&<div>
        <h1 className='text-xl md:text-2xl flex gap-1 items-top md:items-center'>4<ChevronRight className='text-[var(--color-purple)]'/> Create your Question's Options</h1>

 {questionType=='radio'? <div className='flex flex-col'>

     {radioOptions.map((data,index)=><h1 key={index} className='flex items-center' >
      <Radio defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>{data} <Trash2 className='pl-1 cursor-pointer text-red-500' onClick={()=>deleteRadioOption(index)}/></h1>)}

<h1 className='flex items-center'><Radio defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>

<TextField variant='standard' value={radioOptiontext} onChange={(e)=>setradioOptiontext(e.target.value)} />
</h1>
       

    <Button sx={{...themes.OutlinedButtonStyle,mt:2}} onClick={addRadioOption}>+ Add Option</Button>
 
 </div>
:questionType=='checkbox' ?<div>
{checkboxOption.map((data,index)=><h1 className='flex items-center' >
<Checkbox defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>
{data}
<Trash2 className='pl-1 cursor-pointer text-red-500' onClick={()=>deleteCheckboxOption(index)}/></h1>)}

<h1 className='flex items-center' >
<Checkbox defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>
<TextField variant='standard' value={checkboxOptiontext} onChange={(e)=>setCheckboxOptiontext(e.target.value)}  /></h1>

      <div>
        <Button  sx={{...themes.OutlinedButtonStyle,mt:2,width:"100%"}} onClick={addCheckboxOption}>+ Add Option</Button>
        
      </div>

</div> :
<>
</>
}
</div>}

<div className='flex flex-col gap-3'>
 <h1 className='text-xl md:text-2xl flex gap-1 items-top md:items-center' >{questionType=="text"?4:5}<ChevronRight className='text-[var(--color-purple)]'/> Is your Question is Madnatory and to be filled ?</h1>
   <FormControl onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
setIsRequired(e.target.value ==='true')
   }}>
    <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={is_required.toString()} >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value={`true`} control={<Radio sx={{...radiostyles.radioButton}} />} label="Yes" />
                <FormControlLabel sx={{...radiostyles.radioLabel}} value={`false`} control={<Radio sx={{...radiostyles.radioButton}} />} label="No" />
      </RadioGroup>
      </FormControl>
</div>

<div className='flex gap-2'>
  <Button sx={{...themes.OutlinedButtonStyle,width:{md:"10%",xs:"40%"}}} onClick={()=>navigate(-1)}>Discard</Button>
  <Button sx={{...themes.OutlinedButtonStyle,width:{md:"10%",xs:"40%"}}} onClick={handleSaveQuestion}>Save</Button>
</div>
</Card>


</div>

    </>
  )
}

export default QuestionsScreen