import { BriefcaseBusiness, UserCheck, Users } from 'lucide-react'
import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import type { GridColDef } from '@mui/x-data-grid/models';
import { Button } from '@/components/ui/button';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';


interface props {
    icon: any,
    title: string,
   
    count:number
}

function DashboardHome() {

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };




{/**------------------------------------------------------------------------- Reuseable Card ---------------------------------------------------------------------------------------- */}
   const RUDashBoardCard: React.FC<props> = ({ icon: Icon, title, count }) => {
  return (
    <div className="border p-4 sm:p-6 lg:p-9 flex justify-between rounded-xl shadow-sm">
      <h1>
        <Icon className="text-[var(--color-purple)] w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      </h1>
      <div className="flex flex-col items-end">
        <h2 className="text-sm sm:text-lg lg:text-3xl text-[var(--color-purple)]">
          {title}
        </h2>
        <h2 className="text-xs sm:text-base lg:text-lg">{count}</h2>
      </div>
    </div>
  );
};

{/**------------------------------------------------------------------------- Reuseable Card ---------------------------------------------------------------------------------------- */}

    return (
        <>

            <div>
<h1 className=" sm:text-3xl lg:text-6xl">
  Welcome Admin !
</h1>
               <div className='flex flex-col gap-15'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6'>
                    <RUDashBoardCard count={100} icon={UserCheck} title='Users' />
                    <RUDashBoardCard count={122} icon={Users} title='Customers'  />
                    <RUDashBoardCard count={178} icon={BriefcaseBusiness} title='Tasks' />
                </div>
         <div>
            <div className='pb-3 '>
                <Button className='w-[15%] bg-white text-grey-200 border hover:text-white hover:bg-[var(--color-purple)] cursor-pointer'>Filter</Button>

                <div className='pt-2'>
<Collapse ><TextField fullWidth label="search by name" /></Collapse>
                </div>
            </div>
<Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0,boxShadow:"1px 0.5px 10px 0.5px #00000025" }}
      />
    </Paper>
         </div>
         </div>
            </div>

        </>
    )
}

export default DashboardHome