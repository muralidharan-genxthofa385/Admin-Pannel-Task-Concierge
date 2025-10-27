import React from 'react'

  interface props {
    icon: any,
    title: string,
    count: any,
    color:string
}

const HighlightStatsBox:React.FC<props> = ({ icon: Icon, title, count,color})=>{
  
  return (
    <>
   
                <div className={`p-5 sm:p-6 xs:p-2 lg:p-9 flex flex-wrap justify-between rounded-xl  bg-white/10 backdrop-blur-md  
 shadow-[0.2px_0.2px_10px_0.1px_var(--color-purple)]/50
                   border border-[var(--color-purple)]/50 transform transition-transform duration-300 cursor-pointer hover:scale-105 `}>
                    <h1>
                        <Icon style={{color:color}} className={`text-sm w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10 `} />
                    </h1>
                    <div className="flex flex-col items-end">
                        <h2 className={`text-sm sm:text-sm md:text-sm lg:text-2xl text-[var(--color-purple)]  `}>
                            {title.replace(/_/g, " ")}
                        </h2>
                        <h2 style={{color:color}} className={`text--xs sm:text-base font-medium ms:text-sm  lg:text-2xl `}>{count}</h2>
                    </div>
                    </div>
          

    </>
  )
}

export default HighlightStatsBox