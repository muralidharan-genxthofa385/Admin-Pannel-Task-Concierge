import { Card } from '@/components/ui/card'
import { getRequest, postRequest } from '@/Service/Apiservice'
import { themes } from '@/Themes';
import { Box, Button, Menu, MenuItem, Modal, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Ellipsis} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import PolicyIcon from '@mui/icons-material/Policy';
import { toast } from 'react-toastify';

interface Report {
  id: number;
  booking_id: number;
  reason: string;
  reported_user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  reporter: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}


const ReportedUsersTable:React.FC = () => {

    const [ReportedDatas,setReportedDatas]=useState<Report[]>([])
      const [openEditModal, setOpenEditModal] = useState(false)
        const [selectedRowId, setSelectedRowId] = useState(0)
        const [ViewReport,setViewReport]=useState<Report|null>(null)
      
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
 const handleClick = (event: React.MouseEvent<HTMLElement>, rowid: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowid)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    


    useEffect(()=>{
getRequest('/user/reports')
.then((res)=>{
    setReportedDatas(res.data ??[])
 console.log(ReportedDatas||"none")
})
    },[])

    const getUserBYID=(userID:any)=>{

        getRequest(`/user/reports/${userID}`)
        .then((res)=>{
          setViewReport(res.data)
            console.log('>>>>>>>>> user,',ViewReport)
        })
    }

    const unblockUser=(userId:any)=>{
        
        postRequest(`admin/users/${userId}/unblock`,null)
        .then((res)=>{
            console.log('>>>>>>>>> user,',res)
            toast.success('User Unblocked Successfully')
        })
        .catch((err)=>{
            console.log(err)
            toast.error('failed to unblock user ,please try again')

        })
    }
    const columns:GridColDef[]=[
        {field:"reporter",headerName:"Reported By",width:200,renderCell:(params)=>{return <Box  ><Typography>{params.row.reporter.first_name} {params.row?.reporter?.last_name}</Typography>
        <Typography sx={{...themes.lightFont,fontSize:"13px"}}>{params.row.reporter?.email}</Typography>
         </Box>}},

        {field:"reason",headerName:"Reason for report",width:400},
        {field:"reported_user",headerName:"Blocked user",width:170,renderCell:(params)=>{return <Box  ><Typography>{params.row.reported_user.first_name} {params.row?.reported_user?.last_name}</Typography>
        <Typography sx={{...themes.lightFont,fontSize:"13px"}}>{params.row.reported_user?.email}</Typography>
         </Box>}},
         {field:"Actions",headerName:"Actions",renderCell:(p)=>{

            return(
                <>
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
            <MenuItem
            
            onClick={() => {
              setOpenEditModal(true)
getUserBYID(selectedRowId)
// unblockUser(selectedRowId)
              handleClose()
            }} className='flex  gap-2 font-bold'><PolicyIcon className='w-4 h-4 text-[var(--color-purple)]' /> <Typography className='text-[var(--color-purple)]'> Verify</Typography></MenuItem>
            {/* <MenuItem onClick={() => { handleClose() }} className='flex gap-2 '><Trash2 className='w-4 h-4 text-red-500' /> <Typography className='text-[var(--color-purple)]'> Delete</Typography></MenuItem> */}
          </Menu>
        </div>
                </>
            )
         }}
        
    ]


  return (
    <><div>

        <div>
            <Card>
<DataGrid
columns={columns}
rows={ReportedDatas}
rowHeight={60}
sx={{border:"none"}}
/>

            </Card>
        </div>


        
    </div>

 <div>
        <Modal
          className='flex justify-center items-center'
          open={openEditModal}
          onClose={() => { setOpenEditModal(false); handleClose() }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card className='md:w-[40%] w-[95%] h-[80vh]  p-7 overflow-y-scroll [scrollbar-width:none]  [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
            <h2 className="text-2xl  font-semibold mb-6 md:flex-row flex-col flex items-center gap-4"><span className='flex items-center gap-2'><PolicyIcon sx={{color:"var(--color-purple)",fontSize:"2rem"}} />Reported user</span>  <span style={{color:"var(--color-purple)"}}>{""}</span></h2>

            <Box className="flex flex-col gap-5" >
              {/* <Box sx={{display:"flex",justifyContent:"space-between"}}>
                <Typography>Reported by :</Typography>
                <Typography>{ViewReport?.reporter.first_name} {ViewReport?.reporter.last_name}</Typography>
                 </Box>
                   <Box sx={{display:"flex",justifyContent:"space-between"}}>
                <Typography>Blocked User:</Typography>
                <Typography>{ViewReport?.reported_user.first_name} {ViewReport?.reported_user.last_name}</Typography>
                 </Box> */}

               <Box className="flex items-center justify-between w-full">
                  <Card className='w-[49%] p-6'>
                    <Typography sx={{...themes.mediumSizedFont,fontSize:"17px"}}>Reporter Information</Typography>

                 </Card>

                   <Card className='w-[49%]'>

                 </Card>
             </Box>
             

            

             

          
  

            
            <Box sx={{display:"flex",flexDirection:"column",gap:2}}>
              <Button type='submit' sx={themes.ButtonStyle} onClick={()=>{unblockUser(ViewReport?.id);handleClose()}}>
                Unblock User
              </Button>

               <Button 
               onClick={()=>{ setOpenEditModal(false); handleClose() }}
               sx={{textTransform:"none",border:"1px solid var(--color-red)",color:"var(--color-red)",borderRadius:"8px"}}>
                Keep Restricted
              </Button>

              </Box>
            </Box>
          </Card>

        </Modal>
      </div>

    </>
  )
}

export default ReportedUsersTable