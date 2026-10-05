import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Users, Library, Download, Eye } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { capitalize, formatCount } from '../../utils/formatters.js';
import * as adminService from '../../services/adminService.js';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16','#f97316'];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  useEffect(() => { adminService.getAnalytics().then(r => setData(r.data.data)).catch(() => {}); }, []);
  if (!data) return <PageLoader />;

  const u = data.users || {}; const r = data.resources || {};
  const byDeptData = (data.resourcesByDept || []).map(d => ({ name: d.department, count: parseInt(d.count) }));
  const byTypeData = (data.resourcesByType || []).map(t => ({ name: capitalize(t.type.replace('_',' ')), value: parseInt(t.count) }));
  const combinedMonthly = (data.monthlyUploads || []).map((m, i) => ({
    month: m.month,
    uploads: parseInt(m.total),
    downloads: parseInt(data.monthlyDownloads?.[i]?.total || 0),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"     value={u.total}                        icon={Users}    color="blue"   />
        <StatCard title="Total Resources" value={r.total}                        icon={Library}  color="purple" />
        <StatCard title="Total Downloads" value={formatCount(data.downloads?.total)} icon={Download} color="green" />
        <StatCard title="Active Users (30d)" value={data.activeUsers}           icon={Eye}      color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly uploads + downloads */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Uploads & Downloads</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={combinedMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:11}} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uploads"   stroke="#6366f1" strokeWidth={2} dot={false} name="Uploads" />
              <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2} dot={false} name="Downloads" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By department */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Resources by Department</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byDeptData} layout="vertical">
              <XAxis type="number" tick={{fontSize:11}} />
              <YAxis type="category" dataKey="name" width={80} tick={{fontSize:10}} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By type */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Resources by Type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2}>
                {byTypeData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most downloaded table */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Top 10 Downloaded Resources</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-2 font-medium">#</th>
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Department</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Downloads</th>
            </tr></thead>
            <tbody>
              {(data.mostDownloaded||[]).map((r,i) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-3 text-gray-400 font-medium">{i+1}</td>
                  <td className="py-2.5 pr-4 font-medium text-gray-800">{r.title}</td>
                  <td className="py-2.5 pr-4 text-gray-500">{r.department_name}</td>
                  <td className="py-2.5 pr-4 text-gray-500 capitalize">{capitalize(r.resource_type)}</td>
                  <td className="py-2.5 font-bold text-primary-600">{formatCount(r.download_count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
