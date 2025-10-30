import { EditQuestion, getAllServicess, getQuestionByID, getQuestionByServiceID } from '@/Service/Questions_page_service/Questions_page_service'
import { themes } from '@/Themes'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Card } from '@/components/ui/card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
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


const EditQuestions:React.FC = () => {


    const navigate=useNavigate()
    const {id}=useParams()
    
      const [Servicedata, setServicedata] = useState<servicedata[]>([])
      const [selectedService,setSelectedService]=useState<servicedata|null>(null)
      const [question_text,setQuestion_text]=useState('')
      const [radioOptiontext,setradioOptiontext]=useState('')
      const [checkboxOptiontext,setCheckboxOptiontext]=useState('')
      const [serviceQuestion,setServiceQuestion]=useState<questions[]>([])

      const [dataQuestionByID,setDataQuestionByID]=useState({
        setvice_id:selectedService,
        question_text:question_text,
        input_type:'text',
        options_json:[] as string[],
        is_required:false,
        service_name:""
      })
    
     
    
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
    

    useEffect(()=>{
const fetchQuestionByid=async()=>{

try{
    const res=await getQuestionByID(Number(id))
    const Q=res.data
    setDataQuestionByID(prev=>({...prev,
          question_text:Q.question_text, 
        input_type:Q.input_type||"text", 
         options_json:Q.options_json||[], is_required:Q.is_required,
        service_name:Q.service_name
        }))
          console.log("ind question :",Q)
}
catch(err){
    console.log(err)
}

}
fetchQuestionByid()
    },[id])

    
const addOption = (text: string) => {
  if (!text) return;
  setDataQuestionByID(prev => ({
    ...prev,
    options_json: [...prev.options_json, text]
  }));
};

const handleAddOption = () => {
  if (radioOptiontext || checkboxOptiontext) {
    addOption(radioOptiontext || checkboxOptiontext);
    setradioOptiontext('');
    setCheckboxOptiontext('');
  }
};

    const deleteOption = (index: number) => {
  setDataQuestionByID(prev => ({
    ...prev,
    options_json: prev.options_json.filter((_, i) => i !== index)
  }));
};

    
     const fetchQuestionsbyId=async()=>{
    
    try{
      const res=await getQuestionByServiceID(Number(id))
    setServiceQuestion(res.data)
    console.log('service question',res.data)
    }
    catch(err){
    console.log("service question by id error",err)
    }
      }
useEffect(()=>{fetchQuestionsbyId()},[])

    
    const handleSaveQuestion=async()=>{
    if(!dataQuestionByID.question_text){
    toast.error('please enter the question text')
    }else if(!dataQuestionByID.input_type){
      toast.error('please select a service to continue')
    }else if(!dataQuestionByID.input_type){
        toast.error('please select a Question Type to continue')
    }
    else if(!dataQuestionByID.is_required){  toast.error('please select if the question is Required or Not')}
      const payload={
        setvice_id:dataQuestionByID.setvice_id,
        question_text: dataQuestionByID.question_text,
      input_type: dataQuestionByID.input_type,
options_json:dataQuestionByID.options_json,
      is_required: dataQuestionByID.is_required
    
      }
      console.log(  ",payload data",payload)
    
      await EditQuestion(Number(id),payload)
      try{
    toast.success('Question Created Successfully')
        setSelectedService(null)
    setQuestion_text('')
    // navigate(-1)
      }
      catch{
    alert('err')
      }
    
    }
    
    
    
      {/**-------------------------------------------------------- Main function return ----------------------------------------------------- */}


  return (
    <>


<div className='flex flex-col gap-10 '>
  <div><h1 className='sm:text-2xl md:text-2xl flex items-center gap-3 cursor-pointer w-max' onClick={()=>navigate(-1)}><ChevronLeft className='w-6 h-6'/>Edit Questions</h1></div>

 

<Card className='flex flex-col gap-10 shadow rounded-2xl p-6'>

  <div className='flex flex-col gap-3'>
    <h1 className='text-2xl flex gap-1 items-center'>1<ChevronRight className='text-[var(--color-purple)]'/>Service Name</h1>


  <TextField sx={themes.textFieldStyle} value={dataQuestionByID.service_name} label="Service Name" />


</div>
<div>
   <h1 className='text-2xl flex gap-1 items-center'>2<ChevronRight className='text-[var(--color-purple)]'/> Create your Question</h1>
   <TextField  label="" sx={{...themes.inputFeildActions.active}}
   value={dataQuestionByID.question_text} onChange={(e)=>setDataQuestionByID(prev=>({...prev,question_text:e.target.value}))}
   inputProps={{sx:{pl:4}}}  InputLabelProps={{ sx: themes.inputFeildActions.inActive}} variant="standard" fullWidth />

</div>

<div>
    <h1 className='text-2xl flex gap-1 items-center'>3<ChevronRight className='text-[var(--color-purple)]'/> Select your Question Type</h1>
    
      <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" 
      value={dataQuestionByID.input_type} 
      onChange={(e)=>setDataQuestionByID(prev=>({...prev,input_type:e.target.value as 'radio'|'text'|'checkbox'}))} 
       >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="text" control={<Radio sx={{...radiostyles.radioButton}} />} label="Text" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="radio" control={<Radio sx={{...radiostyles.radioButton}} />} label="Radio (single-select)" />
        <FormControlLabel sx={{...radiostyles.radioLabel}} value="checkbox" control={<Radio sx={{...radiostyles.radioButton}} />} label="Checkbox (multiple-select)" />
      </RadioGroup>
    
</div>
 
  {dataQuestionByID.input_type !== "text" && (
  <div className="flex flex-col gap-3">
    <h1 className='text-2xl flex gap-1 items-center'>
      4<ChevronRight className='text-[var(--color-purple)]'/>Create your Question's Options
    </h1>

    {dataQuestionByID.options_json.map((option, index) => (
      <h1 key={index} className="flex items-center">
        {dataQuestionByID.input_type === "radio" 
          ? <Radio defaultChecked sx={{ ...radiostyles.checkboxStyle, scale: 0.9 }} />
          : <Checkbox defaultChecked sx={{ ...radiostyles.checkboxStyle, scale: 0.9 }} />}
        {option}
        <Trash2
          className='pl-1 cursor-pointer text-red-500'
          onClick={() => deleteOption(index)}
        />
      </h1>
    ))}

    <h1 className="flex items-center">
      {dataQuestionByID.input_type === "radio" 
        ? <Radio defaultChecked sx={{ ...radiostyles.checkboxStyle, scale: 0.9 }} />
        : <Checkbox defaultChecked sx={{ ...radiostyles.checkboxStyle, scale: 0.9 }} />}
      <TextField
        variant='standard'
        value={radioOptiontext || checkboxOptiontext}
        onChange={(e) => {
          if (dataQuestionByID.input_type === "radio") setradioOptiontext(e.target.value)
          else setCheckboxOptiontext(e.target.value)
        }}
      />
    </h1>

    <Button
      sx={{ ...themes.OutlinedButtonStyle, mt: 2 }}
      onClick={handleAddOption}
    >
      + Add Option
    </Button>
  </div>
)}


<div className='flex flex-col gap-3'>
 <h1 className='text-2xl flex gap-1 items-center'>{dataQuestionByID.input_type=="text"?4:5}<ChevronRight className='text-[var(--color-purple)]'/> Is your Question is Madnatory and to be filled ?</h1>
   <FormControl onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
setDataQuestionByID(prev=>({...prev,is_required:e.target.value==='true'}))
   }}>
    <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="text" name="radio-buttons-group" value={dataQuestionByID.is_required.toString()} >
        <FormControlLabel sx={{...radiostyles.radioLabel}} value={`true`} control={<Radio sx={{...radiostyles.radioButton}} />} label="Yes" />
                <FormControlLabel sx={{...radiostyles.radioLabel}} value={`false`} control={<Radio sx={{...radiostyles.radioButton}} />} label="No" />
      </RadioGroup>
      </FormControl>
</div>

<div className='flex gap-2'>
  <Button sx={{...themes.OutlinedButtonStyle,width:"10%"}} onClick={()=>navigate(-1)}>Discard</Button>
  <Button sx={{...themes.OutlinedButtonStyle,width:"10%"}} onClick={handleSaveQuestion}>Save</Button>
</div>
</Card>


</div>

    </>
  )
}

export default EditQuestions