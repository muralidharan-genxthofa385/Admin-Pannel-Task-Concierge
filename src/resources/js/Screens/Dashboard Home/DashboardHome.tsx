import { UserCheck, Users, BanknoteArrowDown, ToolCase } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getDashboarDetails } from '@/Service/Dashboard Services/DashboardServices';

interface dashboarddetailsType {
  customers: { total: number };
  services: { name: string; count: number }[];
  taskers: { total: number; active?: number; inactive?: number };
  tasks: {
    accepted: number;
    cancelled: number;
    completed: number;
    in_progress: number;
    pending: number;
    total: number;
  };
}

function DashboardHome() {
  const [dashboardDetails, setDashboardDetails] = useState<dashboarddetailsType | null>(null);

  useEffect(() => {
    getDashboarDetails().then((res) => {
      console.log(res);
      setDashboardDetails(res.data);
    });
  }, []);

  const totalRevenue = 1250300;
  const last30DaysRevenue = 85400;
  const totalBookings = 3200;

  const RUDashBoardCard: React.FC<{ icon: any; title: string; count: any; growth?: string }> = ({
    icon: Icon,
    title,
    count,
    growth,
  }) => {
    return (
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-[var(--color-light)] shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
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
    <div className="min-h-screen bg-white">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8" style={{ color: 'var(--color-darkPurple)' }}>
        Welcome Admin!
      </h1>

   
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <RUDashBoardCard
          title="Total Revenue"
          count={`$${totalRevenue.toLocaleString()}`}
          growth="+5.2%"
          icon={BanknoteArrowDown}
        />
        <RUDashBoardCard
          title="Total Taskers"
          count={dashboardDetails?.taskers.total ?? 0}
          growth="+1.8%"
          icon={UserCheck}
        />
        <RUDashBoardCard
          title="Total Customers"
          count={dashboardDetails?.customers.total ?? 0}
          growth="+12.5%"
          icon={Users}
        />
        <RUDashBoardCard
          title="Top Service"
          count={dashboardDetails?.services[0]?.name ?? "N/A"}
          growth="+3.1%"
          icon={ToolCase}
        />
      </div>

     
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
      

        <div className="flex-1 min-w-72 bg-white rounded-xl border border-[var(--color-light)] p-6 shadow-sm">
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
        </div>

       
        <div className="flex-1 min-w-72 bg-white rounded-xl border border-[var(--color-light)] p-6 shadow-sm">
          <p className="text-base font-medium mb-1" style={{ color: 'var(--color-text)' }}>
            Service Usage Breakdown
          </p>
          <p className="text-4xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            {totalBookings.toLocaleString()}
          </p>
          <div className="flex gap-1 text-sm">
            <p style={{ color: 'var(--color-grey)' }}>Last 30 Days</p>
            <p className="font-medium" style={{ color: 'var(--color-green)' }}>
              +8.9%
            </p>
          </div>
          <div className="grid grid-flow-col gap-6 items-end justify-items-center mt-6 h-40">
            {dashboardDetails?.services.slice(0, 5).map((service, i) => {
              const heights = [100, 30, 75, 50, 20];
              return (
                <div key={service.name} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-t-sm w-full transition-all"
                    style={{
                      height: `${heights[i]}%`,
                      backgroundColor: 'rgba(108, 99, 255, 0.2)', 
                    }}
                  />
                  <p
                    className="text-xs font-bold truncate  text-center"
                    style={{ color: 'var(--color-grey)' }}
                  >
                    {service.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-light)] shadow-sm overflow-hidden">
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