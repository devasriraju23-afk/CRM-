import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { Download, Eye, Library, CheckCircle } from 'lucide-react';
import { formatCount, capitalize } from '../../utils/formatters.js';
import * as resourceService from '../../services/resourceService.js';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16','#f97316'];

export default function FacultyAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await resourceService.getResources({ uploadedBy: user?.id, limit: 100 });
        const resources = res.data.data || [];
        const totalDownloads = resources.reduce((s,r) => s + (r.download_count||0), 0);
        const totalViews     = resources.reduce((s,r) => s + (r.view_count||0), 0);
        const approved = resources.filter(r=>r.status==='approved').length;
        // By type
        const byType = {};
        resources.forEach(r => { byType[r.resource_type] = (byType[r.resource_type]||0)+1; });
        const typeChart = Object.entries(byType).map(([name,value]) => ({ name: capitalize(name), value }));
        // Top resources
        const topDownloads = [...resources].sort((a,b)=>b.download_count-a.download_count).slice(0,5);
        setData({ total: resources.length, totalDownloads, totalViews, approved, typeChart, topDownloads });
      } catch {}
    };
    if (user?.id) load();
  }, [user?.id]);

  if (!data) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">My Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Resources"  value={data.total}                    icon={Library}     color="blue"   />
        <StatCard title="Approved"         value={data.approved}                 icon={CheckCircle} color="green"  />
        <StatCard title="Total Downloads"  value={formatCount(data.totalDownloads)} icon={Download} color="purple" />
        <StatCard title="Total Views"      value={formatCount(data.totalViews)}  icon={Eye}         color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By type */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Resources by Type</h2>
          {data.typeChart.length === 0 ? <p className="text-sm text-gray-400">No data yet.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.typeChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name}: ${value}`} labelLine={false}>
                  {data.typeChart.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top downloads */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Top Downloaded Resources</h2>
          {data.topDownloads.length === 0 ? <p className="text-sm text-gray-400">No data yet.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.topDownloads.map(r=>({ name: r.title.slice(0,20)+'…', downloads: r.download_count }))}>
                <XAxis dataKey="name" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip />
                <Bar dataKey="downloads" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
