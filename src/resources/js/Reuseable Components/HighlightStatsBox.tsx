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
      className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-[var(--color-light)] shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
      style={{
        '--tw-shadow-color': 'rgba(0,0,0,0.1)',
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.setProperty(
          '--tw-shadow-color',
           'var(--color-light)'
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
        <Icon className="w-5 h-5" style={{ color: color || 'var(--color-light)' }} />
      </div>
      <p className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
        {count}
      </p>
    </div>
  )
}

export default HighlightStatsBox
