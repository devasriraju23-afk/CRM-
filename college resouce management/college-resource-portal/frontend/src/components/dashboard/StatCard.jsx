import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100   text-blue-600',   text: 'text-blue-600'   },
  green:  { bg: 'bg-green-50',  icon: 'bg-green-100  text-green-600',  text: 'text-green-600'  },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', text: 'text-orange-600' },
  red:    { bg: 'bg-red-50',    icon: 'bg-red-100    text-red-600',    text: 'text-red-600'    },
  teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-100   text-teal-600',   text: 'text-teal-600'   },
};

export default function StatCard({ title, value, icon: Icon, color = 'blue', trend, trendLabel, subtitle }) {
  const c = colorMap[color] || colorMap.blue;
  const isPositive = trend > 0;

  return (
    <div className={`card p-5 ${c.bg} border-0 hover:shadow-card-hover transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${c.text}`}>{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trendLabel && (
        <div className="flex items-center gap-1 mt-3">
          {trend !== undefined && (
            isPositive
              ? <TrendingUp  className="w-3.5 h-3.5 text-green-500" />
              : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}
