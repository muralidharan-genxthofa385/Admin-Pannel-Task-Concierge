import { deleteQuestionbyId, getAllServicess, getQuestionByServiceID, PostQuestion } from '@/Service/Questions_page_service/Questions_page_service'
import { themes } from '@/Themes'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ChevronLeft, ChevronRight, Pencil, Save, Trash2 } from 'lucide-react'
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
import { Box } from '@mui/material'
interface servicedata{
  name_en:string,
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
    const [question_text_cy,setQuestion_text_cy]=useState('')
  const [questionType,setQuestionType]=useState<'text'|'radio'|'checkbox'>('text')

  const [radioOptions,setRadioOptions]=useState<{ en: string; cy: string }[]>([])
  const [radioOpt_en,setRadioopt_en]=useState('')
  const [radioOpt_cy,setRadioopt_cy]=useState('')


const [checkboxOptions, setCheckboxOptions] = useState< { en: string; cy: string }[]>([]);
const [newCheckboxEn, setNewCheckboxEn] = useState<string>('');
const [newCheckboxCy, setNewCheckboxCy] = useState<string>('');

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
if(radioOpt_en.trim()==""||radioOpt_cy.trim()==""){
  toast.error('Please entar both english and welsh option text')
 }
 const newOpt={
  en:radioOpt_en.trim(),
  cy:radioOpt_cy.trim()
 }

  setRadioOptions(prev=>[...prev,newOpt])
setRadioopt_cy('')
setRadioopt_en('')
}
const deleteRadioOption=(index:any)=>{
  setRadioOptions(prev=>prev.filter((_,i)=>i!==index))
}

const addCheckboxOption = () => {
  if (newCheckboxEn.trim() === '' || newCheckboxCy.trim() === '') {
    toast.error('Please enter both English and Welsh option text');
    return;
  }
  const newOption = {
    en: newCheckboxEn.trim(),
    cy: newCheckboxCy.trim(),
  };

  setCheckboxOptions((prev) => [...prev, newOption]);
  setNewCheckboxEn('');
  setNewCheckboxCy('');
};

const deleteCheckboxOption=(id:number)=>{
  setCheckboxOptions(prev=>prev.filter((_,i)=>i!==id))
}



const handleSaveQuestion=async()=>{
if(!question_text){
toast.error('please enter the question text')
}
if(!question_text_cy){
toast.error('please enter the welsh question text')
}
else if(!selectedService){
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
    questionType=="radio"?radioOptions:questionType=="checkbox"?checkboxOptions:null,
  is_required: is_required

  }
  console.log(  ",payload data",payload)

  await PostQuestion(payload,Number(selectedService?.id))
  try{
toast.success('Question Created Successfully')
setQuestion_text('')
setQuestionType('text')
setRadioOptions([])
 setCheckboxOptions([])
setIsRequired('') 
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
 getOptionLabel={(option) => option.name_en}
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
  <Button size='small' sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"20%",fontSize:"14px"}} onClick={()=>navigate(`/questions/edit/${data.id}`)}>Edit <Pencil className='w-4 h-4 ml-2' /></Button>
  <Button size='small' sx={{...themes.OutlinedButtonStyle,fontWeight:400,width:"20%",fontSize:"14px"}} onClick={()=>deleteQuestion(data.id)}> Delete <Trash2 className='w-4 h-4 ml-2 text-red-500' /></Button>
</div>
</div>
              </div>)}
    </div>}
    
    {/**----Questions display */}

</div>

<div>
   <h1 className='text-xl md:text-2xl flex gap-1 items-center'>2<ChevronRight className='text-[var(--color-purple)]'/> Create your Question</h1>
   <Box className="flex  gap-5 pt-4">
    <Card className='w-1/2 p-4'>
   <TextField  label="Question (English)*" 
   multiline
   minRows={1}
   maxRows={3}
   sx={{...themes.inputFeildinActive,width:"100%"}}
   value={question_text} onChange={(e)=>setQuestion_text(e.target.value)}
   inputProps={{sx:{pl:4}}}  InputLabelProps={{ sx: themes.inputFeildActions.inActive}} placeholder='enter here' variant="standard" 
   
   />
   </Card>

<Card className='w-1/2 p-4'>
   <TextField  label="Question (Welsh)*" sx={{...themes.inputFeildinActive}}
   value={question_text_cy} onChange={(e)=>setQuestion_text_cy(e.target.value)}
   inputProps={{sx:{pl:4}}}  InputLabelProps={{ sx: themes.inputFeildActions.inActive}} placeholder='enter here' variant="standard" fullWidth />

</Card>

   </Box>

</div>

<div>
    <h1 className='text-xl md:text-2xl flex gap-1 items-top md:items-center'>3<ChevronRight className='text-[var(--color-purple)]'/> Select your Question Type</h1>
     <FormControl
     onChange={radioOnchange}
     >
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={questionType} >
        <FormControlLabel sx={{...radiostyles.radioLabel,
        '& .MuiFormControlLabel-label':questionType=="text"? {...themes.mediumSizedFont,fontSize:"14px"}:{ ...themes.lightFont}
        }} value="text" control={<Radio sx={{...radiostyles.radioButton}} />} label="Text" />
        <FormControlLabel sx={{...radiostyles.radioLabel,
         '& .MuiFormControlLabel-label':questionType=="radio"? {...themes.mediumSizedFont,fontSize:"14px"}:{ ...themes.lightFont}
          }} value="radio" control={<Radio sx={{...radiostyles.radioButton}} />} label="Radio (single-select)" />
        <FormControlLabel sx={{...radiostyles.radioLabel,
'& .MuiFormControlLabel-label':questionType=="checkbox"? {...themes.mediumSizedFont,fontSize:"14px"}:{ ...themes.lightFont}
          }} value="checkbox" control={<Radio sx={{...radiostyles.radioButton}} />} label="Checkbox (multiple-select)" />
      </RadioGroup>
    </FormControl>
    
</div>
 
  {questionType!=="text"&&<div>
        <h1 className='text-xl md:text-2xl flex gap-1 items-top md:items-center'>4<ChevronRight className='text-[var(--color-purple)]'/> Create your Question's Options</h1>

 {questionType=='radio'? <div className='flex flex-col'>

     {radioOptions.map((data,index)=><div key={index} className='flex items-center gap-' >
   <>   <Radio defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>

      <span className="flex-1">
      {data.en} <em className="text-gray-500">({data.cy})</em>
    </span><Trash2 className='pl-1 cursor-pointer text-red-500' onClick={()=>deleteRadioOption(index)}/></>
      
       </div>)}

<h1 className='flex items-center'><Radio defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>

<Box className="flex gap-5" >

<TextField variant='standard'
label={'option (en)'} 
sx={{...themes.inputFeildinActive}}
InputLabelProps={{ sx: themes.inputFeildActions.inActive}}
value={radioOpt_en} onChange={(e)=>setRadioopt_en(e.target.value)} />

  <TextField variant='standard'
  label={'option (cy)'} 
sx={{...themes.inputFeildinActive}}
InputLabelProps={{ sx: themes.inputFeildActions.inActive}}
  value={radioOpt_cy} onChange={(e)=>setRadioopt_cy(e.target.value)} />
</Box>
</h1>
       

    <Button sx={{...themes.OutlinedButtonStyle,mt:2}} onClick={addRadioOption}>+ Add Option</Button>
 
 </div>
:questionType=='checkbox' ?<div>
{checkboxOptions.map((option,index)=><div className='flex items-center ' >
<Checkbox defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>
<span className="flex-1">
      {option.en} <em className="text-gray-500">({option.cy})</em>
    </span>
<Trash2
      className="cursor-pointer text-red-500 w-5 h-5"
      onClick={() => deleteCheckboxOption(index)}
    />  
</div>)}

<h1 className='flex items-center' >
<Checkbox defaultChecked sx={{...radiostyles.checkboxStyle,scale:0.9}}/>

<Box className="flex gap-5" >
<TextField variant='standard' 
label={'option (en)'} 
sx={{...themes.inputFeildinActive}}
InputLabelProps={{ sx: themes.inputFeildActions.inActive}}
value={newCheckboxEn} onChange={(e)=>setNewCheckboxEn(e.target.value)}  />
<TextField variant='standard' label={'option (cy)'} 
sx={{...themes.inputFeildinActive}}
InputLabelProps={{ sx: themes.inputFeildActions.inActive}}
value={newCheckboxCy} onChange={(e)=>setNewCheckboxCy(e.target.value)}  />
</Box>
</h1>

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
  <Button sx={{...themes.OutlinedButtonStyle,width:{md:"10%",xs:"40%"}}} className='flex items-center gap-2' onClick={()=>navigate(-1)}><ChevronLeft/> Back</Button>
  <Button sx={{...themes.OutlinedButtonStyle,width:{md:"10%",xs:"40%"}}} className='flex items-center gap-2' onClick={handleSaveQuestion}><Save/> Save</Button>
</div>
</Card>


</div>

    </>
  )
}

export default QuestionsScreen