import { UserCheck, Users, ToolCase, Ellipsis, SearchIcon, PoundSterling } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getDashboarDetails } from '@/Service/Dashboard Services/DashboardServices';
import { Card } from '@/components/ui/card';
import { getRequest } from '@/Service/Apiservice';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
// import Revenuegarph from './Revenuegraph';
import { themes } from '@/Themes';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { FormControl, InputLabel, Select } from '@mui/material';


interface dashboarddetailsType {
  services: { name: string; count: number }[];
  top_completed_services: { name: string; count: number }[];
  taskers: { total: number; active?: number; inactive?: number };
  residents: {
    total: number
  },
  business_users: {
    approved: number,
    rejected: number,
    pending: number
  },
  tasks: {
    accepted: number;
    cancelled: number;
    active: number;
    completed: number;
    in_progress: number;
    pending: number;
    total: number;
  };
}
interface pendingData {
  id: number
  first_name: string;
  last_name: string;
  phone: string;
  reason: string;
  status: string;
  email: string;
}

interface revenueDataType {

  daily_this_week: any,
  weekly_this_month: any,
  monthly_this_year: any
}
interface Revenuedetails{
   total_payments: number
    total_admin_fees:number,
}

function DashboardHome() {


  const [dashboardDetails, setDashboardDetails] = useState<dashboarddetailsType | null>(null);
  const [pendingData, setPendingData] = useState<pendingData[]>([])
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [PaginationModel, setPaginationModel] = useState<{ page: number; pageSize: number }>({ page: 0, pageSize: 10, });
  const [totalCount, _setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedrowid, setSelectedRowid] = useState<number | null>(null)
  const [revenuedata, setRevenuedata] = useState<revenueDataType>({} as revenueDataType)
  const [totalRevenue, setTotalRevenue] = useState<Revenuedetails >({ total_payments: 0, total_admin_fees: 0 })
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, rowId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowid(rowId)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchPending_approvals = async () => {
    try {
      const res = await getRequest(`admin/pending-registrations`)
      setPendingData(res.data.data)
      console.log("pending approval >>", pendingData)
    }
    catch (err) { }

  }

  ChartJS.register();
  const fetch_revenue = async () => {

    try {
      const res = await getRequest(`admin/revenue`)
      setRevenuedata(res.data.summary)
      setTotalRevenue(res.data.summary)
      setRevenuedata(res.data.periods)
      console.log("revenue data >>", totalRevenue)

    }
    catch {

    }

  }


  useEffect(() => {
    setLoading(true)
    getDashboarDetails().then((res) => {
      console.log(res);
      setDashboardDetails(res.data);
    })
      .finally(() => {
        setLoading(false)
      })
    fetchPending_approvals()
    fetch_revenue()
  }, []);



  const columns: GridColDef[] = [
    { field: 'first_name', headerName: 'Name', width: 240, renderCell: (p) => (<>{p.row.first_name} {p.row.last_name}</>) },
    { field: 'phone', headerName: 'Phone', width: 240, renderCell: (p) => (<>+ {p.row.phone}</>) },
    { field: 'email', headerName: 'Email', width: 240, renderCell: (p) => (<>{p.row.email}</>) },
    {
      field: 'status', headerName: 'Status', width: 200, renderCell: (p) => (<Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography className={`${p.row.status == "awaiting_approval" ? 'bg-amber-500' : "bg-green-600"} p-2 rounded-3xl text-white`}
          sx={{ display: "flex", alignItems: "center" }}>
          {p.row.status}</Typography> </Box>)
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (d) => (
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e) => handleClick(e, d.row.user_id)}
          ><Ellipsis /> </Button>
          <Menu
            id="basic-menu"
            PaperProps={{ sx: { boxShadow: '0.3px 1px 3px rgba(0,0,0,0.1)', borderRadius: '10px', }, }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
              },
            }}
          >
            <MenuItem onClick={() => { navigate(`/business/approval/${selectedrowid}`, { state: { pending_id: d.row.user_id } }) }} className='flex gap-2'><SearchIcon className='text-[var(--color-purple)]' /> Verify</MenuItem>
            {/* <MenuItem onClick={()=>{handleApprove(selectedrowid||0,"approve");handleClose()}} className='flex gap-2'><CheckCircle className='text-[var(--color-purple)]' /> Approve</MenuItem>
        <MenuItem onClick={()=>{handleApprove(selectedrowid||0,"reject");handleClose();}} className='flex gap-2'><X className='text-[var(--color-red)]' /> Reject</MenuItem> */}
          </Menu>
        </div>
      )
    }
  ]

  const getChartData = () => {
    if (!revenuedata) return { labels: [], data: [] };

    let periodData: Record<string, any> = {};

    if (timeRange === 'daily') {
      periodData = revenuedata?.daily_this_week || {};
    } else if (timeRange === 'weekly') {
      periodData = revenuedata?.weekly_this_month || {};
    } else if (timeRange === 'monthly') {
      periodData = revenuedata?.monthly_this_year || {};
    }

    const entries = Object.entries(periodData);
    if (timeRange === 'weekly') {
      entries.sort((a, b) => Number(a[1].label) - Number(b[1].label));
    }

    const labels = entries.map(([_, item]) => item.label);
    const revenueValues = entries.map(([_, item]) => item.total_payments || 0);

    return { labels, data: revenueValues };
  };

  const { labels, data } = getChartData();




  const RUDashBoardCard: React.FC<{ icon: any; title: string; count: any; growth?: string, navigation?: string }> = ({
    icon: Icon,
    title,
    count,
    growth,
    navigation
  }) => {
    return (
      <div onClick={() => navigate(navigation || "")} className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-[var(--color-light)] shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: 'var(--color-grey)' }}>
            {title}
          </p>
          <Icon className="w-5 h-5" style={{ color: 'var(--color-grey)' }} />
        </div>
        <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          {count}
        </p>
        {growth && (
          <p className="text-sm font-medium" style={{ color: 'var(--color-green)' }}>
            {growth}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className=" bg-white">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8" style={{ color: 'var(--color-darkPurple)' }}>
        Welcome Admin!
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        {/* <RUDashBoardCard
          title="Total Revenue"
          count={`$${totalRevenue.toLocaleString()}`}
          growth="+5.2%"
          icon={BanknoteArrowDown}
        /> */}
        <RUDashBoardCard
          title="Total Taskers"
          count={dashboardDetails?.taskers.total}
          navigation="/taskers"
          icon={UserCheck}
        />
        <RUDashBoardCard
          title="Total Customers"
          count={dashboardDetails?.residents.total ?? 0}
          navigation='/customers'
          icon={Users}
        />
        <RUDashBoardCard
          title="Approved Business Users"
          count={dashboardDetails?.business_users.approved ?? 0}
          navigation="/business/user"
          icon={Users}
        />
        <RUDashBoardCard
          title="Awaiting Business Users"
          count={dashboardDetails?.business_users.pending ?? 0}
          navigation="/business/approval"
          icon={ToolCase}
        />
        <RUDashBoardCard
          title="Rejected Business Users"
          count={dashboardDetails?.business_users.rejected ?? 0}
          navigation="/business/approval"
          icon={ToolCase}
        />
      </div>


      <div className='hidden'>
        <Card className='p-8'>
          <h3 className="text-3xl lg:text-2xl font-bold  mb-8">Business Approvals</h3>

          <Card className='md:w-full rounded-2xl'>
            <DataGrid
              rows={pendingData ?? []}
              columns={columns}
              paginationMode="server"
              paginationModel={PaginationModel}
              onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
              pageSizeOptions={[5, 10, 15]}
              rowCount={totalCount}
              loading={loading}
              getRowId={(row) => row.id || `${row.email}-${row.phone}`}  // fallback ID
              sx={{ border: 0, width: "100%" }}
            />
          </Card>

        </Card>

      </div>



      <div className=" flex-col lg:flex-row gap-6 mb-8 flex"> {/**>>>>>>>>>>>>>Graph <<<<<<<<<<<< */}


        <div className="flex-1 min-w-72 bg-white rounded-xl border border-[var(--color-light)] p-6 shadow-sm">
          <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>
            Tasks analysis
          </p>
          <p className="text-4xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            {dashboardDetails?.tasks.total}
          </p>
          <div className="flex gap-1 text-sm">
            <p style={{ color: 'var(--color-grey)' }}>Total Task Activities </p>
            {/* <p className="font-medium" style={{ color: 'var(--color-green)' }}>
              +8.9%
            </p> */}
          </div>
          <div className="grid grid-flow-col gap-6 items-end justify-items-center mt-6">

            <PieChart
              series={[
                {
                  data: dashboardDetails?.tasks
                    ? [
                      { id: 0, value: dashboardDetails.tasks.pending, label: 'Pending', color: '#f59e0b' },
                      { id: 1, value: dashboardDetails.tasks.active, label: 'Active', color: '#3b82f6' },
                      { id: 2, value: dashboardDetails.tasks.accepted, label: 'Accepted', color: '#8b5cf6' },
                      { id: 3, value: dashboardDetails.tasks.completed, label: 'Completed', color: 'var(--color-green)' },
                      { id: 4, value: dashboardDetails.tasks.cancelled, label: 'Cancelled', color: '#ef4444' },
                    ].filter(item => item.value > 0)
                    : [],
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 8,
                  arcLabelMinAngle: 35,
                }
              ]}
              width={300}
              height={220}
            />

            {/* Fallback message when no data */}
            {dashboardDetails?.tasks?.total === 0 && (
              <p className="text-gray-500 mt-4">No tasks recorded yet</p>
            )}

          </div>
        </div>


        <div className="flex-1 min-w-72 bg-white rounded-xl border border-[var(--color-light)] p-6 shadow-sm">
          <p className="text-base font-medium mb-1" style={{ color: 'var(--color-text)' }}>
            Top 3 Service Usage Breakdown
          </p>
          <p className="text-4xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            {dashboardDetails?.tasks.total}
          </p>
          <div className="flex gap-1 text-sm">
            <p style={{ color: 'var(--color-grey)' }}>Last 30 Days</p>
            <p className="font-medium" style={{ color: 'var(--color-green)' }}>
              +8.9%
            </p>
          </div>
          <div className="grid grid-flow-col gap-0 items-end justify-items-center mt-6 h-40">
            {dashboardDetails?.top_completed_services.map((service, i) => {
              const heights = [150, 100, 60];
              return (
                <div key={service.name} className="flex flex-col items-center gap-2">
                  {/* <div className="absolute hidden group-hover:block">
    <Typography>
      {service.name} {service.count}
    </Typography>
  </div> */}
                  <div
                    className="rounded-t-sm w-full transition-all"

                  />
                  <div
                    style={{
                      height: `${heights[i]}px`,
                      backgroundColor: 'var(--color-purple)',
                      borderRadius: '4px 4px 0 0',
                      width: '50%',
                      transition: 'height 0.3s ease',
                    }}
                  ></div>
                  <p
                    className="text-xs font-bold truncate  text-center"
                    style={{ color: 'var(--color-grey)' }}
                  >
                    {service.name} ({service.count})
                  </p>
                </div>
              );
            })}
          </div>
        </div>




      </div>

      <div className='w-full'>


        <Card className='p-6 w-full rounded-2xl'>

          <Typography sx={{ ...themes.largeHeading }} className='p-3 border-b-2'>
            Revenue Over Time
          </Typography>
          <div className='flex gap-3 w-full items-center flex-wrap' >
             <div  className="w-full lg:w-1/4">
             
               <RUDashBoardCard
              title="Total Revenue Generated"
              count={`£${totalRevenue.total_payments}`}
              icon={PoundSterling}
            />
            </div> 
           
            <div className="w-full lg:w-1/4">
                 <RUDashBoardCard
              title="Total Admin Fee Generated"
              count={`£${totalRevenue.total_admin_fees}`}
              icon={PoundSterling}
            />
            </div>

              <div className="flex w-[100%] md:w-45% sm:w-full  items-center justify-end mb-4 ">

            <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }} >
          <InputLabel
            id="time-range-select-label"
            sx={{ '&.Mui-focused': { color: 'var(--color-purple)' } }}
          >
            Period
          </InputLabel>
          <Select
          defaultValue="monthly"
            labelId="time-range-select-label"
            value={timeRange}
            label="Period"
           onChange={(e) => setTimeRange(e.target.value as any)}
            sx={{
              borderRadius: 0.6,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.700' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-purple)',
                borderWidth: '2px',
              },
            }}
          >
                          <MenuItem value="monthly">This Year (Monthly)</MenuItem>
              <MenuItem value="weekly">This Month (Weekly)</MenuItem>
          <MenuItem value="daily">This Week (Daily)</MenuItem>

          </Select>
        </FormControl>
          </div>

          </div>

        

          <div style={{ height: '500px', position: 'relative' }}>
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: 'Revenue',
                    data,
                 backgroundColor: '#6C63FF',          
borderColor: '#8b5cf6',
hoverBackgroundColor: 'rgba(139, 92, 246, 0.85)',
                    borderWidth: 1,
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                 
                },
                scales: {

                 
                },
              }}
            />
          </div>

          {data.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-500">
              No revenue data available for this period
            </div>
          )}
        </Card>

      </div>

      {/* <div className="flex-1 min-w-72 bg-white rounded-xl border border-[var(--color-light)] p-6 shadow-sm">
          <p className="text-base font-medium mb-1" style={{ color: 'var(--color-text)' }}>
            Revenue Over Time
          </p>
          <p className="text-4xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            ${last30DaysRevenue.toLocaleString()}
          </p>
          <div className="flex gap-1 text-sm">
            <p style={{ color: 'var(--color-grey)' }}>Last 30 Days</p>
            <p className="font-medium" style={{ color: 'var(--color-green)' }}>
              +15.3%
            </p>
          </div>
          <div className="mt-6">
            <svg
              viewBox="-3 0 478 150"
              className="w-full h-40"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="revenueGradient" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="var(--color-purple)" stopOpacity="0.15" />
                  <stop offset="1" stopColor="var(--color-purple)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                fill="url(#revenueGradient)"
              />
              <path
                d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                stroke="var(--color-purple)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="flex justify-around mt-2 text-xs font-bold" style={{ color: 'var(--color-grey)' }}>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div> */}

      <div className="bg-white rounded-xl border border-[var(--color-light)] shadow-sm overflow-hidden hidden"> {/**>>>>>>>>>>>>>Recent Activities<<<<<<<<<<<< */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--color-light)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            Recent Activity
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-grey)' }}>
            A feed of recent events in the platform.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b" style={{ backgroundColor: 'var(--color-light)', borderColor: 'var(--color-light)' }}>
              <tr>
                <th className="p-4 text-sm font-semibold" style={{ color: 'var(--color-grey)' }}>
                  User
                </th>
                <th className="p-4 text-sm font-semibold" style={{ color: 'var(--color-grey)' }}>
                  Activity
                </th>
                <th className="p-4 text-sm font-semibold" style={{ color: 'var(--color-grey)' }}>
                  Status
                </th>
                <th className="p-4 text-sm font-semibold" style={{ color: 'var(--color-grey)' }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b" style={{ borderColor: 'var(--color-light)' }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-light)' }} />
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                      John Doe
                    </p>
                  </div>
                </td>
                <td className="p-4" style={{ color: 'var(--color-dark-text)' }}>
                  New User Signup
                </td>
                <td className="p-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(43, 147, 72, 0.1)',
                      color: 'var(--color-green)',
                    }}
                  >
                    Verified
                  </span>
                </td>
                <td className="p-4" style={{ color: 'var(--color-grey)' }}>
                  2 mins ago
                </td>
              </tr>
              <tr className="border-b" style={{ borderColor: 'var(--color-light)' }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-light)' }} />
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                      Jane Smith
                    </p>
                  </div>
                </td>
                <td className="p-4" style={{ color: 'var(--color-dark-text)' }}>
                  Service Booking Completed
                </td>
                <td className="p-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(108, 99, 255, 0.1)', // --color-purple 10%
                      color: 'var(--color-purple)',
                    }}
                  >
                    Completed
                  </span>
                </td>
                <td className="p-4" style={{ color: 'var(--color-grey)' }}>
                  15 mins ago
                </td>
              </tr>
              <tr>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: 'var(--color-light)' }} />
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                      Alex Johnson
                    </p>
                  </div>
                </td>
                <td className="p-4" style={{ color: 'var(--color-dark-text)' }}>
                  New Tasker Onboarded
                </td>
                <td className="p-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(255, 193, 7, 0.1)', // Yellow-500 10%
                      color: '#d97706',
                    }}
                  >
                    Pending
                  </span>
                </td>
                <td className="p-4" style={{ color: 'var(--color-grey)' }}>
                  1 hour ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;