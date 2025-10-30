import { Card } from '@/components/ui/card'
import { deleteQuestionbyId, getAllQuestions, getQuestionByServiceID } from '@/Service/Questions_page_service/Questions_page_service'
import { themes } from '@/Themes'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Ellipsis, Eye, FilePen, Settings, SquarePen, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Modal from '@mui/material/Modal'

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

const QuestionsDataTable: React.FC = () => {

  const navigate = useNavigate()


  const [params, setparams] = useState({
    category_id: 0,
    search: "",
    sort_by: "",
    sort_order: "",
    per_page: 10,
    page: 0

  })

  const [openmodal, setOpenmodal] = React.useState(false);



  const [questions, setQuestions] = useState<questions[]>()
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedrowid, setSelectedRowid] = useState<number | null>(null)
  const [viewQuestions, setViewquestions] = useState<questions[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });


  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>, rowId: number) => {
    setAnchorEl(e.currentTarget);
    setSelectedRowid(rowId)
  };
  const fetchQuestions = async () => {
    const apiPage = params.page + 1

    const res = await getAllQuestions(params.category_id, params.search, params.sort_by, params.sort_order, params.per_page, apiPage);
    try {
      setQuestions(res.data.items)
      setTotalCount(res.data.pagination.total)
      console.log(res)

      console.log('Fetching with params:', {
        service_id: params.category_id,
        search: params.search,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
        per_page: params.per_page,
        page: params.page + 1
      });

    }
    catch (err) {

    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [params])

  useEffect(() => {
    setparams(prev => ({ ...prev, page: paginationModel.page, per_page: paginationModel.pageSize }));
  }, [paginationModel]);




  const ViewIndividualQuestions = async (serviceId: number) => {
    try {
      const res = await getQuestionByServiceID(serviceId);
      console.log("Questions for service:", res.data);
      setViewquestions(res.data)

      setOpenmodal(true);
    } catch (err) {
      console.log("Error fetching questions:", err);
    }
  };


  const deleteQuestion = (id: number) => {
    deleteQuestionbyId(id)
      .then(() => {
        toast.success("Question Deleted Success")
        handleClose();
        fetchQuestions()

      })
      .catch(() => toast.error('Failed to delete this question'))
  }

  const columns: GridColDef[] = [
    { field: 'service', headerName: "Service Name", width: 230, renderCell: (params) => (<span>{params.row.service?.name || 'N/A'}</span>), },
    { field: 'category', headerName: "Category", width: 240, renderCell: (params) => (<span>{params.row.service?.category?.name}</span>) },
    { field: 'question_text', headerName: "Question", width: 500 },
    {
      field: 'options_json', headerName: "Options", width: 400,
      renderCell: (params) => {
        const options = params.row.options_json;
        return <span >{options && options.length > 0 ? options.join(', ') : '-'}</span>;
      }
    },

    {
      field: 'actions', headerName: "Actions", width: 200, renderCell: (act) => (
        <>
          <div>
            <Button
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) => handleClick(e, act.row.id)}
            >
              <Ellipsis />
            </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
               PaperProps={{ sx: { boxShadow: '0.3px 1px 3px rgba(0,0,0,0.1)',borderRadius: '10px', }, }}
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
              <MenuItem onClick={() => {
                handleClose();
                const selectedQuestion = questions?.find(q => q?.id === selectedrowid);
                if (selectedQuestion?.service) {
                  ViewIndividualQuestions(selectedQuestion.service?.id);
                } else {
                  toast.error("Service ID not found for this question");
                }
              }}
                className='flex gap-3'><Eye className='w-4 h-5 text-[var(--color-purple)]'/> <Typography> View</Typography></MenuItem>
              <MenuItem onClick={() => {
                handleClose;
                if (selectedrowid !== null) { navigate(`/questions/edit/${selectedrowid}`) }
              }} className='flex gap-3 '><FilePen className='w-4 h-4 text-[var(--color-purple)]' /> <Typography > Edit</Typography></MenuItem>
              <MenuItem onClick={() => { if (selectedrowid !== null) { deleteQuestion(Number(selectedrowid)) }; handleClose }} className='flex gap-3'><Trash2 className='w-4 h-4 text-red-500' /> <Typography> Delete</Typography></MenuItem>

            </Menu>
          </div>
        </>
      )
    }

  ]


  return (
    <>
      <div className='flex flex-col gap-10'>
        <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><SquarePen className='w-6 h-6' /> Service Questions</h1>
        <div className='flex md:gap-0 xs:gap-10 md:flex-row flex-col w-full justify-between'>
          <TextField {...params} label="Search by Questions" value={params.search} onChange={(e) => setparams(prev => ({ ...prev, search: e.target.value }))} sx={{ ...themes.textFieldStyle, width: {md:"76%",xs:"100%"} }} />

          <FormControl sx={{ ...themes.textFieldStyle, width: {md:"11%",xs:"100%"},mt:{xs:3,md:0} }} >
            <InputLabel>filter by category</InputLabel>
            <Select label='filter by category'
              value={params.category_id}
              onChange={(e) => setparams(prev => ({ ...prev, category_id: Number(e.target.value), page: 0 }))}
            >
              
              <MenuItem className='flex gap-2' value={""}>Clear <X className='w-4 h-4' /></MenuItem>
              <MenuItem value={1}>Skilled</MenuItem>
              <MenuItem value={2}>UnSkilled</MenuItem>
              <MenuItem value={3}>Business & Events</MenuItem>
            </Select>
          </FormControl>

          <Button sx={{ ...themes.OutlinedButtonStyle,width: {md:"11%",xs:"100%"},mt:{xs:3,md:0}  }} onClick={() => window.location.href = '/questions/creation'}>+Add</Button>
        </div>



        <div>
          <Card className='md:w-full w-[100%] h-141'>
<DataGrid
  rows={questions || []}
  columns={columns}
  className='rounded border-0'
  paginationMode="server"
  rowCount={totalCount}
  sx={{border:"none"}}
  pageSizeOptions={[5, 10, 15]}
  paginationModel={paginationModel}
  onPaginationModelChange={(newModel) => {
    setPaginationModel(newModel);  
    setparams(prev => ({
      ...prev,
      page: newModel.page,
      per_page: newModel.pageSize
    }));
  }}
/>


          </Card>
        </div>



      </div>

      {/**---------- View individual question------------- */}
      <div>
        {/* <Button onClick={() => setOpenmodal(false)}>Open modal</Button> */}
        <Modal
          className='flex justify-center items-center'
          open={openmodal}
          onClose={() => { setOpenmodal(false); handleClose() }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card className='w-[40%]  p-5'>
            <Typography sx={{ ...themes.largeHeading, display: "flex", alignItems: "center", gap: 2, fontWeight: 500 }}><Settings className='w-10 h-10' />Service Questions</Typography>

            <Card className='w-[100%]  p-5 overflow-auto'>

              {viewQuestions == undefined ? <Typography>Failed to Fetch...!</Typography> : viewQuestions.map((data, ind) => <div>
                
               <Typography className='flex items-center gap-3 border-b-1 pb-2'> <span className='bg-gray-200 rounded' style={{padding:5}}>Q{ind+1}</span> <span className='text-1xl'>{data.question_text}</span></Typography>

              </div>)}

            </Card>
            <Button sx={themes.OutlinedButtonStyle} onClick={()=>navigate(`/questions/edit/${selectedrowid}`)}>Edit This Question</Button>
          </Card>
        </Modal>
      </div>
      {/**---------- View individual question------------- */}

    </>
  )
}

export default QuestionsDataTable