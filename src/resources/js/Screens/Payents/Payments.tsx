import { getRequest } from '@/Service/Apiservice'
import { Box, Card, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox'
import { Money } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { themes } from '@/Themes'


interface revenueDataType {
booking_date: string;
  service_name: string;
  total_cost: number;
  admin_fee: number;
  is_paid:boolean
  taskers: { tasker_name: string; earnings: number

   }[];
  customer:{
    profile_pic:string,
    name:string,
    email:string,
  }
  total:number

}

interface Revenuedetails{
   total_payments: number
    total_admin_fees:number,
}
interface paramsType{
  is_paid:number,
  page:number,
per_page:number,
service_name:string

}


const Payments:React.FC = () => {
 
      const [revenuedata, setRevenuedata] = useState<revenueDataType[]>([])
      const [loader,setLoader]=useState(false)
      const [totalRevenue, setTotalRevenue] = useState<Revenuedetails >({ total_payments: 0, total_admin_fees: 0 })
          const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({page: 0,  pageSize: 10,});
          const [total,setTotal]=useState(0)
      const [params,setParams]=useState<paramsType>({
        is_paid:1,
        page:1,
        per_page:10,
        service_name:""

      })
    

      const fetch_revenue = async () => {
        
    setLoader(true)
        try {
          const res = await getRequest(`admin/revenue?per_page=${params.per_page}&page=${params.page}&is_paid=${params.is_paid}&service_name=${params.service_name}`)
          
          setRevenuedata(res.data.bookings.data ||[])

                setTotalRevenue(res.data.summary)
                setTotal(res.data.bookings.total)
          console.log("revenue data >>",res.data.bookings)
          
    
        }
        catch { }
    finally{
      setLoader(false)
    }
      }

      useEffect(()=>{
fetch_revenue()
      },[params])
        useEffect(()=>{
      setParams(prev=>({...prev,page:PaginationModel.page+1,per_page:PaginationModel.pageSize}))
        },[PaginationModel])

     const columns: GridColDef[] = [
  {
    field: 'booking_date',
    headerName: 'Booking Date',
    width: 200,
  },
  {
    field: 'service_name',
    headerName: 'Service',
    width: 260,
  },{
field:"name",
headerName:"Customer Name",
width:220,
valueGetter: (_value, row) => row.customer?.name || '—',
  },
  {
    field: 'total_cost',
    headerName: 'Total Cost',
    width: 180,
    valueFormatter: (value) => `£${Number(value).toFixed(2)}`,
  },
  {
    field: 'admin_fee',
    headerName: 'Admin Fee',
    width: 180,
    valueFormatter: (value) => `£${Number(value).toFixed(2)}`,
  },
  {
    field: 'tasker_name',
    headerName: 'Main Tasker',
    width: 220,
    valueGetter: (_value, row) => row.taskers?.[0]?.tasker_name || '—',
  },
  {
    field:"is_paid",
    headerName:"Payment Status",
    width:180,
    renderCell:({row})=>
      (<Box sx={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100%"}}>
    <Typography sx={{...themes.mediumSizedFont,color:"white",backgroundColor:row.is_paid?"var(--color-green)":"var(--color-red)",
      width:"70%",textAlign:"center",p:0.8,borderRadius:"10px",fontWeight:400
    }}>
      {row.is_paid?"Paid":"Pending"}</Typography>
      </Box>)
    
  },
  {
    field:"Actions",
    headerName:"Actions",
    renderCell:(_params)=>(<>
    
    </>)
  }
];


    return (
    <>
    <Box>
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
    <HighlightStatsBox icon={Money} title='Total Revenue' count={ `£ ${totalRevenue.total_payments.toFixed(1)}`} />
     <HighlightStatsBox icon={Money} title='Total Admin Fee' count={ `£ ${totalRevenue.total_admin_fees.toFixed(1)}`} />

 </div>

 <Card className='rounded-xs p-3 w-full'>
  <div className='w-full pt-1 pb-1'>
<div className='flex flex-col gap-4 w-[100%]'>
  <Typography sx={{...themes.mediumSizedFont}}>{"Filter"}</Typography>
  <div className='flex gap-6' >
      <TextField className='w-3/4 flex' value={params.service_name} onChange={(e)=>setParams(prev=>({...prev,service_name:e.target.value}))} label="Search by service" />
      <FormControl className='w-1/4' >
        <InputLabel>Payment Status</InputLabel>
      <Select  
      value={params.is_paid}
       onChange={(e)=>setParams(prev=>({...prev,is_paid:e.target.value}))}
      label="Payment Status"
      >
        <MenuItem  value={1}  >Paid</MenuItem>
                <MenuItem value={0}>UnPaid</MenuItem>

      </Select>
      </FormControl>
  </div>
  </div>
  </div>

    <DataGrid 
    rows={revenuedata}
    columns={columns}
    sx={{border:"none",borderRadius:"20px"}}
    getRowId={(row) => row.booking_id}
  paginationModel={PaginationModel}
  onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
  pageSizeOptions={[5, 10, 15]}
    paginationMode="server"
    rowCount={total}
    loading={loader}
    />
    {/* <Box>
      <Button
      onClick={()=>setParams(Prev=>({...Prev,page:params.page-1}))}
      ><ChevronLeft/> </Button>
            <Button
            onClick={()=>setParams(Prev=>({...Prev,page:params.page+1}))}
            ><ChevronRight/> </Button>

    </Box> */}

 </Card>


    </Box>



    </>
  )
}

export default Payments