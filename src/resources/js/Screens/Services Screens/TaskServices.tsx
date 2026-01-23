import { Card } from '@/components/ui/card'
import { Create_new_service, delete_a_service, Edit_service, getAllServices, getServiceById } from '@/Service/TaskServicePage/TaskServices_service'
import { themes } from '@/Themes'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { CheckCircle, Ellipsis, FilePen, PencilIcon, Settings, Trash2, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify'
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';


interface serviceData {
  id: number;
  base_price: number;
  category: { name_en: string,name_cy: string, id: number };
  name_en: string
  name_cy:string
}

interface payloadtype {
  category_id: null | number,
  serviceName: string,
  serviceName_cy:string,
  description_cy:string
  description: string,
  basePrice: number,
  image: File | null

}

const TaskServices: React.FC = () => {
  // const navigate=useNavigate()

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const [loading, setLoading] = useState(false)
  const [serviceData, setserviceData] = useState<serviceData[]>([])
  const [selectedRowId, setSelectedRowId] = useState(0)
  const [totalCount, setTotalcount] = useState(0)
  const [paginationModel, setPaginationmodel] = useState({ page: 0, pageSize: 10 })
  const [openmodal, setOpenmodal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = useState(false)


  const [params, setParams] = useState({
    category_id: 0,
    search: "",
    sort_by: "",
    sort_order: "",
    per_page: 10,
    page: 0
  })

  const [createServiceFormData, setcreateServiceFormData] = useState<payloadtype>({
    category_id: null,
    serviceName: "",
    description: "",
        serviceName_cy:"",
    description_cy:"",
    basePrice: 0,
    image: null
  })

  const [editServicebyid,setEditServicebyid]=useState<payloadtype>({
     category_id: null,
    serviceName: "",
    description: "",
    basePrice: 0,
    image: null,
    serviceName_cy:"",
    description_cy:"",
  })

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>, rowid: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowid)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchAllservices = () => {
    setLoading(true)
    getAllServices(params.category_id, params.search, params.sort_by, params.sort_order, params.per_page, params.page)
      .then((res) => {
        setserviceData(res.data.items)
        setTotalcount(res.data.pagination.total)
        console.log(res)
        console.log("pagination :", res.data.pagination.total)
      })
      .catch((err) => console.log('error at fetching taskdata', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAllservices()
  }, [params])

  

    const getIndservicebyid=(id:number)=>{
          getServiceById(Number(id))
    .then((res)=>{
      console.log("ind",res.data.service)
      const servicedata=res.data.service
    

    setEditServicebyid({
        category_id: servicedata.category_id,
        serviceName: servicedata?.name_en,
        description: servicedata.description_en,   
        basePrice: servicedata?.base_price,
        image: servicedata?.image_url,           
        serviceName_cy: servicedata?.name_cy,      
        description_cy: servicedata?.description_cy,
      });
    })


    }
console.log("row id",selectedRowId)


  const addNewService = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      category_id: createServiceFormData.category_id,
      name_en: createServiceFormData.serviceName,
      description_en: createServiceFormData.description,
      base_price: createServiceFormData.basePrice,
      image_url: createServiceFormData.image,
       name_cy:createServiceFormData.serviceName_cy,
      description_cy:createServiceFormData.description_cy,
    }
    Create_new_service(payload,true)
      .then(() => {
        toast.success('Service Added Successfully')
        setOpenmodal(false)
        setcreateServiceFormData({
          category_id: null,
          serviceName: "",
          description: "",
          basePrice: 0,
          image: null,
          serviceName_cy:"",
    description_cy:"",
        })
        fetchAllservices()
      })
      .catch((_err) => {
        toast.error('Failed to add a service')
      })

  }


  const handleEdit_service=async(e:React.FormEvent)=>{
    e.preventDefault()
    const payload={
  category_id: editServicebyid.category_id,
      name_en: editServicebyid.serviceName,
      description_en: editServicebyid.description,
      name_cy:editServicebyid.serviceName_cy,
      description_cy:editServicebyid.description_cy,
      base_price: editServicebyid.basePrice,
      image_url: editServicebyid.image
    }
        console.log("edited",payload)


    try{
     await Edit_service(selectedRowId,payload,true)
     toast.success('Service Edited Successfully')
      setOpenEditModal(false)
      fetchAllservices()
    }

    catch{
toast.error('Failed to edit this service')
    }

  }


  const handledeleteservice = async (id: number | string) => {
    try {
      await delete_a_service(Number(id))
      fetchAllservices()
      toast.success('Service Deleted Successfully')
    }
    catch {
      toast.error('Failed to delete an Error')
    }
  }



  const columns: GridColDef[] = [
    { field: 'name_en', headerName: 'Name', width: 510 },
    {
      field: 'category_id',
      headerName: 'Category Name',
      width: 500,
      renderCell: (params) => (<span>{params.row.category.name_en || 'Unknown'}</span>),
    },
    { field: "base_price", headerName: 'Base Price', width: 390 },

    {
      field: 'actions', headerName: "Actions", width: 100,
      renderCell: (p) => (
        <div>
          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e) => handleClick(e, p.row.id)}
          >
            <Ellipsis />
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            PaperProps={{ sx: { boxShadow: '0.3px 1px 3px rgba(0,0,0,0.1)',borderRadius: '10px', }, }}
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
            <MenuItem onClick={() => {
              setOpenEditModal(true)
              getIndservicebyid(selectedRowId)
              handleClose()
            }} className='flex gap-3 '><FilePen className='w-4 h-4 text-[var(--color-purple)]' /> <Typography className='text-[var(--color-purple)]'> Edit</Typography></MenuItem>
            <MenuItem onClick={() => { handledeleteservice(Number(selectedRowId)); handleClose() }} className='flex gap-3'><Trash2 className='w-4 h-4 text-red-500' /> <Typography className='text-[var(--color-purple)]'> Delete</Typography></MenuItem>
          </Menu>
        </div>
      )
    }
  ];



  return (

    <>
      <div className='flex flex-col gap-10'>
        <h1 className='sm:text-2xl md:text-2xl flex items-center gap-3'><Settings className='w-6 h-6' /> Services</h1>

        {/**---------- Filter Section---------- */}
        <div className='flex flex-col gap-5 md:flex-row w-[100%]'>
          <TextField
            label="Search By Name"
            className="md:w-3/4 w-[100%]"
            value={params.search}
            onChange={(e) => setParams(prev => ({ ...prev, search: e.target.value, page: 0 }))}
            variant="outlined"
            sx={themes.textFieldStyle}
          />

          <FormControl className="md:w-1/4 [100%]" sx={themes.textFieldStyle}>
            <InputLabel>Search By Category</InputLabel>
            <Select
              value={params.category_id || ""}
              label="Search By Category"
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                setParams(prev => ({
                  ...prev,
                  category_id: selectedId,
                  page: 0,
                }));
              }}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              <MenuItem value={1}>Skilled</MenuItem>
              <MenuItem value={2}>UnSkilled</MenuItem>
              <MenuItem value={3}>Business & Events</MenuItem>
            </Select>
          </FormControl>

          <Button className='md:w-[10%]' size='small' sx={{ ...themes.OutlinedButtonStyle }} onClick={() => setOpenmodal(true)}>
            Add +
          </Button>
        </div>
        {/**---------- Filter Section---------- */}

        <div>
          <Card className='md:w-full w-[100%] h-131'>
            <DataGrid
              rows={serviceData}
              paginationMode='server'
              rowCount={totalCount}
              paginationModel={{ page: params.page, pageSize: params.per_page }}
              onPaginationModelChange={(model) => {
                setPaginationmodel(model)
                setParams(prev => ({ ...prev, page: model.page, per_page: model.pageSize }))
              }}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10, 20]}
              sx={{ border: 0, width: { md: "100%" } }}
              loading={loading}
            />
          </Card>
        </div>
      </div>

      {/**------------------------------------------------Service creation form------------- */}

      <div className='w-100'>
        <Modal
          className='flex justify-center items-center'
          open={openmodal}
          onClose={() => { setOpenmodal(false); handleClose()}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card className='md:w-[40%] w-[95%]  p-7 overflow-y-scroll h-[80vh]'>
            <h2 className="text-2xl font-semibold mb-6">Create New Service</h2>
            <form className="flex flex-col gap-5" onSubmit={addNewService}>
              <div className="flex flex-col gap-2">
                <label htmlFor="category_id" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <FormControl sx={themes.textFieldStyle}>
                  <Select id="category_id" name="category_id" sx={themes.textFieldStyle}
                   value={createServiceFormData.category_id}
                   onChange={(e) => setcreateServiceFormData(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                  >
                    <MenuItem value={1}>Skilled</MenuItem>
                    <MenuItem value={2}>Unskilled</MenuItem>
                    <MenuItem value={3}>Business & Events</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Service Name(en) <span className="text-red-500">*</span>
                </label>
                <TextField
                  value={createServiceFormData.serviceName}
                  onChange={(e) => setcreateServiceFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Web Development"
                  sx={themes.textFieldStyle}

                />
              </div>
  <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Service Name(cy) <span className="text-red-500">*</span>
                </label>
                <TextField
                  value={createServiceFormData.serviceName_cy}
                  onChange={(e) => setcreateServiceFormData(prev => ({ ...prev, serviceName_cy: e.target.value }))}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Web Development"
                  sx={themes.textFieldStyle}

                />
              </div>
              {/* Description */}
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (en) <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="description"
                  onChange={(e) => setcreateServiceFormData(prev => ({ ...prev, description: e.target.value }))}
                  value={createServiceFormData.description}
                  name="description"
                  placeholder="Provide a detailed description of the service..."
                  sx={themes.textFieldStyle}
                  maxRows={4}
                  minRows={1}
                  rows={5}
                />
              </div>
                 <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (cy) <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="description"
                  onChange={(e) => setcreateServiceFormData(prev => ({ ...prev, description_cy: e.target.value }))}
                  value={createServiceFormData.description_cy}
                  name="description"
                  placeholder="Provide a detailed description of the service..."
                  sx={themes.textFieldStyle}
                  maxRows={4}
                  minRows={1}
                  rows={5}
                />
              </div>

              {/* Base Price */}
              <div className="flex flex-col gap-2">
                <label htmlFor="base_price" className="text-sm font-medium">
                  Base Price <span className="text-red-500">*</span>
                </label>
                <TextField
                onWheel={(e:any)=>e.target.blur()}
                  onChange={(e) => setcreateServiceFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                  value={createServiceFormData.basePrice}
                  type="number"
                  id="base_price"
                  name="base_price"
                  placeholder="e.g., 50.00"
                  sx={themes.textFieldStyle}
                />
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-2">
                <label htmlFor="image_url" className="text-sm font-medium">
                  Upload Image
                </label>


                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  className='flex gap-3 items-center rounded'
                  sx={{ ...themes.mediumSizedFont, fontSize: "17px", backgroundColor: "transparent", boxShadow: "none", color: "var(--color-purple)", p: 5, border: "2px dotted var(--color-purple)" }}
                >
                  {createServiceFormData.image !== null ? <> <CheckCircle className='text-green-500' />{createServiceFormData.image.name}
                    <Trash2 className='text-red-500' onClick={(e) => { e.stopPropagation(); setcreateServiceFormData(prev => ({ ...prev, image: null })) }} /></>
                    : <><Upload /> Upload files</>}
                  <VisuallyHiddenInput
                    type="file"
                    accept='image/*'
                    onChange={(event) => {
                      const files = event.target.files?.[0] || null
                      
                      if(!files) return;
                      const allowedtype=['image/png','image/jpeg','image/webp']
                      if(!allowedtype.includes(files.type)){
                         toast.error('Only PNG, JPG, or WEBP images are allowed!');
                        return;}
                         const maxSize = 5 * 1024 * 1024;
    if (files.size > maxSize) {
      toast.error('File size must be below 5 MB!');
      return;
    }

                      setcreateServiceFormData(prev => ({ ...prev, image: files }))
                    }}
                  />
                </Button>
              </div>

              <Button type='submit' sx={themes.ButtonStyle}>
                Create Service
              </Button>
            </form>
          </Card>

        </Modal>
      </div>
      {/**---------- Service creation form------------- */}




      {/**------------------------------------------------✏️✏️✏️✏️✏️✏️✏️✏️Service EDIT form------------- */}
      <div>
        <Modal
          className='flex justify-center items-center'
          open={openEditModal}
          onClose={() => { setOpenEditModal(false); handleClose() }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card className='md:w-[40%] w-[95%] h-[80vh]  p-7 overflow-y-scroll'>
            <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><PencilIcon />Edit</span>  <span style={{color:"var(--color-purple)"}}>{editServicebyid.serviceName}</span></h2>

            <form className="flex flex-col gap-5" onSubmit={handleEdit_service}>
              <div className="flex flex-col gap-2">
                <label htmlFor="category_id" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <FormControl sx={themes.textFieldStyle}>
                  <Select
                    id="category_id"
                    name="category_id"
                    sx={themes.textFieldStyle}
                    value={editServicebyid.category_id}
                    onChange={(e) => setEditServicebyid(prev => ({ ...prev, category_id: Number(e.target.value) }))}
                  >
                    <MenuItem value={1}>Skilled</MenuItem>
                    <MenuItem value={2}>Unskilled</MenuItem>
                    <MenuItem value={3}>Business & Events</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Service Name(en) <span className="text-red-500">*</span>
                </label>
                <TextField
                  value={editServicebyid.serviceName}
                  onChange={(e) => setEditServicebyid(prev => ({ ...prev, serviceName: e.target.value }))}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Web Development"
                  sx={themes.textFieldStyle}

                />
              </div>

               <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Service Name(cy) <span className="text-red-500">*</span>
                </label>
                <TextField
                  value={editServicebyid.serviceName_cy}
                  onChange={(e) => setEditServicebyid(prev => ({ ...prev, serviceName_cy: e.target.value }))}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Web Development"
                  sx={themes.textFieldStyle}

                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description(en) <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="description"
                  onChange={(e) => setEditServicebyid(prev => ({ ...prev, description: e.target.value }))}
                  value={editServicebyid.description}
                  name="description"
                  placeholder="Provide a detailed description of the service..."
                  sx={themes.textFieldStyle}
                  maxRows={4}
                  minRows={1}
                  rows={5}
                />
              </div>

   <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description(cy) <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="description"
                  onChange={(e) => setEditServicebyid(prev => ({ ...prev, description_cy: e.target.value }))}
                  value={editServicebyid.description_cy}
                  name="description"
                  placeholder="Provide a detailed description of the service..."
                  sx={themes.textFieldStyle}
                  maxRows={4}
                  minRows={1}
                  rows={5}
                />
              </div>

              {/* Base Price */}
              <div className="flex flex-col gap-2">
                <label htmlFor="base_price" className="text-sm font-medium">
                  Base Price <span className="text-red-500">*</span>
                </label>
                <TextField
                  onChange={(e) => setEditServicebyid(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                  value={editServicebyid.basePrice}
                  type="number"
                  id="base_price"
                  name="base_price"
                  placeholder="e.g., 50.00"
                  sx={themes.textFieldStyle}
                />
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-2">
                <label htmlFor="image_url" className="text-sm font-medium">
                  Upload Image
                </label>


                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  className='flex gap-3 items-center rounded'
                  sx={{ ...themes.mediumSizedFont, fontSize: "17px", backgroundColor: "transparent", boxShadow: "none", color: "var(--color-purple)", p: 5, border: "2px dotted var(--color-purple)" }}
                >
                  {editServicebyid.image !== null ? <Typography sx={{display:"flex",justifyContent:"space-between",gap:"2rem",wordBreak:"break-all"}} width={"80%"}> <CheckCircle className='text-green-500 w-10 h-10' />{typeof editServicebyid.image === 'string'  ? editServicebyid.image : editServicebyid.image.name.slice(0,20)}
                    <Trash2 className='text-red-500 w-10 h-10' onClick={(e) => { e.stopPropagation(); setEditServicebyid(prev => ({ ...prev, image: null })) }} /></Typography>
                    : <><Upload /> Upload files</>}
                  <VisuallyHiddenInput
                    type="file"
                    accept='image/*'
                    onChange={(event) => {
                      const files = event.target.files?.[0] || null
                       if(!files) return;
                      const allowedtype=['image/png','image/jpeg','image/webp']
                      if(!allowedtype.includes(files.type)){
                         toast.error('Only PNG, JPG, or WEBP images are allowed!');
                        return;}
                         const maxSize = 5 * 1024 * 1024;
    if (files.size > maxSize) {
      toast.error('File size must be below 5 MB!');
      return;
    }
                      setEditServicebyid(prev => ({ ...prev, image: files }))
                    }}
                  />
                </Button>
              </div>

              <Button type='submit' sx={themes.ButtonStyle}>
                Save Service
              </Button>
            </form>
          </Card>

        </Modal>
      </div>
      {/**----------✏️✏️✏️✏️ Service Edit form------------- */}


    </>
  )
}

export default TaskServices