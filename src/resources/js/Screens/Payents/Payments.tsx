import { getRequest } from '@/Service/Apiservice'
import { Box, Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HighlightStatsBox from '../../Reuseable Components/HighlightStatsBox'
import { Money } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'


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

}


interface Revenuedetails{
   total_payments: number
    total_admin_fees:number,
}


const Payments:React.FC = () => {
 
      const [revenuedata, setRevenuedata] = useState<revenueDataType[]>([])
      const [totalRevenue, setTotalRevenue] = useState<Revenuedetails >({ total_payments: 0, total_admin_fees: 0 })
    

      const fetch_revenue = async () => {
    
        try {
          const res = await getRequest(`admin/revenue`)
          
          setRevenuedata(res.data.bookings.data ||[])
                setTotalRevenue(res.data.summary)
          console.log("revenue data >>",res.data.bookings.data)
    
        }
        catch { }
    
      }

      useEffect(()=>{
fetch_revenue()
      },[])

     const columns: GridColDef[] = [
  {
    field: 'booking_date',
    headerName: 'Booking Date',
    width: 180,
  },
  {
    field: 'service_name',
    headerName: 'Service',
    width: 180,
  },{
field:"name",
headerName:"Customer Name",
width:180,
renderCell:(_value)=>{
    <>

    </>
}
  },
  {
    field: 'total_cost',
    headerName: 'Total Cost',
    width: 140,
    valueFormatter: (value) => `£${Number(value).toFixed(2)}`,
  },
  {
    field: 'admin_fee',
    headerName: 'Admin Fee',
    width: 140,
    valueFormatter: (value) => `£${Number(value).toFixed(2)}`,
  },
  {
    field: 'tasker_name',
    headerName: 'Main Tasker',
    width: 180,
    valueGetter: (_value, row) => row.taskers?.[0]?.tasker_name || '—',
  },
];

    return (
    <>
    <Box>
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
    <HighlightStatsBox icon={Money} title='Total Revenue' count={ `£ ${totalRevenue.total_payments.toFixed(1)}`} />
     <HighlightStatsBox icon={Money} title='Total Admin Fee' count={ `£ ${totalRevenue.total_admin_fees.toFixed(1)}`} />

 </div>

 <Card>

    <DataGrid 
    rows={revenuedata}
    columns={columns}
    getRowId={(row) => row.booking_id}
    />

 </Card>


    </Box>



    </>
  )
}

export default Payments