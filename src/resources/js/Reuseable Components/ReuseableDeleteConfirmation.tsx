import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Info } from 'lucide-react';
import { themes } from '@/Themes';
import { Button } from '@mui/material';

interface props{
    deleteFun:()=>void
    handleClose:()=>void;
    open:boolean
}

const ReuseableDeleteConfirmation:React.FC<props> = ({handleClose,open,deleteFun}) => {

    
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "25%",
  borderRadius:"10px",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};




  return (
    <div>
<Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box className="flex flex-col items-center">
                <Info style={{color:"var(--color-red)"}} size={80} />
                 <Typography  sx={{...themes.mediumSizedFont,fontSize:"19px"}}>
             Delete Record ?
            </Typography>
            <Typography  sx={{...themes.mediumSizedFont,fontWeight:400,pt:2}}>
              Do you really want to delete this Record ? This Cannot be undone.
            </Typography>
            <Box className='flex justify- flex-col w-full pt-2 gap-5' >
           <Button onClick={()=>deleteFun()} sx={{...themes.ButtonStyle}}>Yes</Button>
           <Button sx={{...themes.OutlinedButtonStyle}} onClick={()=>handleClose()}>No</Button>
            </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default ReuseableDeleteConfirmation