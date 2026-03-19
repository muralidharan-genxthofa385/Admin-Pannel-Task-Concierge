import { themes } from '@/Themes'
import { Box, Typography } from '@mui/material'
import React from 'react'

interface props{
    head:string;
    content:number|boolean|string
}

const InfoBox:React.FC<props> = ({head,content}) => {
  return (
    <div>

<Box sx={{display:"flex",gap:0.4,border:"1px solid var(--color-inputborder)",width:"max-content",p:0.5,backgroundColor:"var(--color-inputbg)",borderRadius:"8px"}}>
                    <Typography sx={{...themes.lightFont}}>{head} :</Typography>
                    <Typography sx={{...themes.lightFont,color:"var(--color-black)"}}>{content}</Typography>
                  </Box>

    </div>
  )
}

export default InfoBox