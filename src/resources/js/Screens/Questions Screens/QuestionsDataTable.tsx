import { Card } from '@/components/ui/card'
import { deleteQuestionbyId, getAllQuestions } from '@/Service/Questions_page_service/Questions_page_service'
import { themes } from '@/Themes'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Ellipsis, FilePen, SquarePen, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'

interface questions{
input_type:string,
options_json:string[],
question_text:string,
service:{
    category:{name:string},
    name:string
}

}

const QuestionsDataTable:React.FC = () => {

    const [params, setparams] = useState({
        service_id:0,
        search:"",
        sort_by:"",
        sort_order:"",
        per_page:10,
        page:0

    })


    const [questions,setQuestions]=useState<questions[]>()
const [totalCount, setTotalCount] = useState(0);


 const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    const fetchQuestions=async()=>{

             const res=await getAllQuestions(params.service_id,params.search,params.sort_by,params.sort_order,params.per_page,params.page+1);
             try{
                setQuestions(res.data.items)
                setTotalCount(res.data.total)
                 console.log(questions)
             }
             catch(err){

             }
        }

    useEffect(()=>{
        fetchQuestions()
    },[params.service_id,params.search,params.sort_by,params.sort_order,params.per_page,params.page])


    const deleteQuestion=(id:number)=>{
        deleteQuestionbyId(id)
        .then(()=>{
            toast.success("Question Deleted Success")
            fetchQuestions()
            
        })
        .catch(()=>toast.error('Failed to delete this question'))
    }

    const columns:GridColDef[]=[
        {field:'service',headerName:"Service Name",width:230,renderCell: (params) => ( <span>{params.row.service?.name || 'N/A'}</span> ),},
        {field:'category',headerName:"Category",width:240,renderCell:(params)=>(<span>{params.row.service?.category?.name}</span>)},
        {field:'question_text',headerName:"Question",width:500},
        {field:'options_json',headerName:"Options",width:400,
            renderCell:(params)=>{
                const options=params.row.options_json;
                return <span >{options && options.length > 0 ? options.join(', ') : '-'}</span>;
            }
        },
        {field:'actions',headerName:"Actions",width:200,renderCell:(act)=>(
            <>
            <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
    <Ellipsis/>
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
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
        <MenuItem onClick={handleClose} className='flex gap-3 '><FilePen className='w-4 h-4 text-[var(--color-purple)]'/> <Typography className='text-[var(--color-purple)]'> Edit</Typography></MenuItem>
        <MenuItem onClick={()=>{deleteQuestion(act.row.id);handleClose()}} className='flex gap-3'><Trash2 className='w-4 h-4 text-red-500'/> <Typography className='text-[var(--color-purple)]'> Delete</Typography></MenuItem>
      </Menu>
    </div>
            </>
        )}

    ]
    
    // const paginationModel={page:0,pageSize:7}

  return (
    <>
   <div className='flex flex-col gap-10'>
<h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><SquarePen className='w-6 h-6'/> Service Questions</h1>
<div className='flex w-full justify-between'>
<TextField {...params}  label="Search by Questions" value={params.search} onChange={(e)=>setparams(prev=>({...prev,search:e.target.value}))} sx={{...themes.textFieldStyle,width:"76%"}}/> 
   
    <FormControl  sx={{...themes.textFieldStyle,width:"11%"}} >
        <InputLabel>filter by category</InputLabel>
        <Select  label='filter by category'
        value={params.service_id}
        onChange={(e)=>setparams(prev=>({...prev,service_id:Number(e.target.value)}))}

>
            <MenuItem className='flex gap-2' value={""}>Clear <X className='w-4 h-4'/></MenuItem>
            <MenuItem value={1}>Skilled</MenuItem>
            <MenuItem value={2}>UnSkilled</MenuItem>
            <MenuItem value={3}>Business & Events</MenuItem>
        </Select>
    </FormControl>

    <Button sx={{...themes.OutlinedButtonStyle,width:"10%"}} onClick={()=>window.location.href='/questions/creation'}>+Add</Button>

</div>

<div>
    <Card className='md:w-full w-[17%] h-131'>
   <DataGrid
  rows={questions || []}
  columns={columns}
  paginationModel={{page:params.page,pageSize:params.per_page}}
  onPaginationModelChange={(data)=>{
    setparams(prev=>({...prev,page:data.page,per_page:data.pageSize}))
  }}
  loading={!questions}
  rowCount={totalCount}
  paginationMode="server"
  pageSizeOptions={[5, 10, 20,30,40]}
  sx={{ border: 0, width: { md: '100%' } }}
/>

    </Card>
</div>



    </div>

    </>
  )
}

export default QuestionsDataTable