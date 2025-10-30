import React from 'react'

interface Props {
  icon: any
  title: string
  count: any
  color?: string
}

const HighlightStatsBox: React.FC<Props> = ({ icon: Icon, title, count, color }) => {
  return (
    <div
      className="
        flex flex-col gap-2 rounded-xl p-6 bg-white border border-[var(--color-light)] 
        shadow-sm/50 hover:shadow-lg/50 transition-all cursor-pointer
      "
      style={{
        // default shadow color (non-hover)
        '--tw-shadow-color': 'rgba(0,0,0,0.1)',
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.setProperty(
          '--tw-shadow-color',
          color || 'rgba(0,0,0,0.2)'
        );
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.setProperty(
          '--tw-shadow-color',
          'rgba(0,0,0,0.1)'
        );
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-grey)]">{title}</p>
        <Icon className="w-5 h-5" style={{ color: color || 'var(--color-grey)' }} />
      </div>
      <p className="text-3xl font-bold" style={{ color: color || 'var(--color-text)' }}>
        {count}
      </p>
    </div>
  )
}

export default HighlightStatsBox
