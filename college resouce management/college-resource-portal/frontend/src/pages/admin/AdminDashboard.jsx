import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Library, Download, Clock, CheckSquare, BarChart2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/dashboard/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate, capitalize, formatCount } from '../../utils/formatters.js';
import * as adminService from '../../services/adminService.js';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    adminService.getAnalytics().then(r => setAnalytics(r.data.data)).catch(() => {});
  }, []);

  if (!analytics) return <PageLoader />;
  const u = analytics.users || {};
  const r = analytics.resources || {};

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-violet-100 mt-1 text-sm">Portal management overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={u.students}  icon={Users}       color="blue"   />
        <StatCard title="Total Faculty"  value={u.faculty}   icon={Users}       color="green"  />
        <StatCard title="Total Resources" value={r.total}    icon={Library}     color="purple" />
        <StatCard title="Total Downloads" value={formatCount(analytics.downloads?.total)} icon={Download} color="orange" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Approvals" value={analytics.pendingApprovals} icon={Clock}       color="orange" />
        <StatCard title="Approved Resources" value={r.approved}               icon={CheckSquare} color="green"  />
        <StatCard title="Active Users (30d)" value={analytics.activeUsers}    icon={Users}       color="teal"   />
        <StatCard title="Rejected"           value={r.rejected}               icon={Library}     color="red"    />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/approvals" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <CheckSquare className="w-4 h-4" /> Review Approvals {analytics.pendingApprovals > 0 && <span className="ml-1 bg-red-400 text-white rounded-full px-1.5 text-xs">{analytics.pendingApprovals}</span>}
        </Link>
        <Link to="/admin/users" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Users className="w-4 h-4" /> Manage Users
        </Link>
        <Link to="/admin/analytics" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <BarChart2 className="w-4 h-4" /> Full Analytics
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly downloads chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Downloads</h2>
          {analytics.monthlyDownloads?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.monthlyDownloads}>
                <XAxis dataKey="month" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400">No data yet.</p>}
        </div>

        {/* Recent uploads */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Uploads</h2>
            <Link to="/admin/resources" className="text-xs text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {(analytics.recentUploads || []).slice(0,6).map(r => (
              <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.uploader_first_name} {r.uploader_last_name} · {formatDate(r.created_at)}</p>
                </div>
                <Badge label={capitalize(r.status)} variant={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most downloaded */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Most Downloaded Resources</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-xs text-gray-400">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium hidden md:table-cell">Department</th>
              <th className="pb-2 font-medium">Downloads</th>
              <th className="pb-2 font-medium hidden sm:table-cell">Views</th>
            </tr></thead>
            <tbody>
              {(analytics.mostDownloaded||[]).map(r => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4"><Link to={`/admin/resources/${r.id}`} className="font-medium text-gray-800 hover:text-primary-600 line-clamp-1">{r.title}</Link></td>
                  <td className="py-2.5 pr-4 hidden md:table-cell text-gray-500">{r.department_name}</td>
                  <td className="py-2.5 pr-4 font-semibold text-primary-600">{formatCount(r.download_count)}</td>
                  <td className="py-2.5 hidden sm:table-cell text-gray-500">{formatCount(r.view_count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
