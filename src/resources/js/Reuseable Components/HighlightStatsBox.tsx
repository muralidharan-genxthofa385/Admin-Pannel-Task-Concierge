import React from 'react'

  interface props {
    icon: any,
    title: string,
    count: any,
    color:string
}

const HighlightStatsBox:React.FC<props> = ({ icon: Icon, title, count})=>{
  
  return (
    <>
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
      
      </div>
          

    </>
  )
}

export default HighlightStatsBox