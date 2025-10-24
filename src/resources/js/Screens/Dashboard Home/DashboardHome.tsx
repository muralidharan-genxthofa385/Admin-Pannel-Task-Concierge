import { UserCheck, Users,BanknoteArrowDown, ToolCase } from 'lucide-react'
import React from 'react'
import DashboardGraph from '@/components/DashboardGraph';
import Barchart from '@/components/BarChart';


interface props {
    icon: any,
    title: 'Taskers' | 'Customers' | 'Tasks' | 'Revenue',
    count:any
}

function DashboardHome() {

  const cardColors = {
  Taskers: { icon: 'text-gray-500', shadow: 'shadow-[0_0_5px_var(--color-purple)]' },
  Customers: { icon: 'text-amber-500', shadow: 'shadow-[0_0_5px_var(--color-purple)]' },
  Tasks: { icon: 'text-blue-400', shadow: 'shadow-[0_0_5px_var(--color-purple)]'},
  Revenue: { icon: 'text-green-500', shadow: 'shadow-[0_0_5px_var(--color-purple)]' }
};


{/**------------------------------------------------------------------------- Reuseable Card ---------------------------------------------------------------------------------------- */}
   const RUDashBoardCard: React.FC<props> = ({ icon: Icon, title, count }) => {
    const colors=cardColors[title];
  return (
    <div   className={`p-5 sm:p-6 xs:p-2 lg:p-9 flex justify-between rounded-xl  bg-white/10 backdrop-blur-md  
       ${colors.shadow} 
             border border-white/20 transform transition-transform duration-300 cursor-pointer hover:scale-105 `}>
      <h1>
        <Icon className={`text-[var(--color-purple)] w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 ${colors.icon}`} />
      </h1>
      <div className="flex flex-col items-end">
        <h2 className={`text-sm sm:text-lg lg:text-2xl text-[var(--color-purple)]  `}>
          {title}
        </h2>
        <h2 className={`text-xs sm:text-base font-medium  lg:text-2xl ${colors.icon}`}>{count}</h2>
      </div>
    </div>
  );
};

{/**------------------------------------------------------------------------- Reuseable Card ---------------------------------------------------------------------------------------- */}

    return (
        <>

            <div className='p-0' >
<h1 className=" sm:text-10xl lg:text-6xl">Welcome Admin !</h1>

               <div className='flex flex-col gap-15 '>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6'>
                    <RUDashBoardCard count={100} icon={UserCheck} title='Taskers' />
                    <RUDashBoardCard count={122} icon={Users} title='Customers'  />
                    <RUDashBoardCard count={178} icon={ToolCase} title='Tasks' />
                    <RUDashBoardCard count={`$ ${1234454}`} title='Revenue' icon={BanknoteArrowDown} />
                </div>
            <div className='flex flex-wrap justify-between gap-3 md:gap-0' >
                <DashboardGraph/>
                <Barchart/>
                
                
</div>
         </div>
            </div>

        </>
    )
}

export default DashboardHome