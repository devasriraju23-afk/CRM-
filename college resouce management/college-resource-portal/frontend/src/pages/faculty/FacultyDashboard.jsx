import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Library, CheckCircle, Clock, Download, ArrowRight, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import Badge from '../../components/common/Badge.jsx';
import { formatDate, capitalize, formatCount } from '../../utils/formatters.js';
import * as resourceService from '../../services/resourceService.js';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [all, approved, pending] = await Promise.allSettled([
        resourceService.getResources({ uploadedBy: user?.id, limit: 100, status: '' }),
        resourceService.getResources({ uploadedBy: user?.id, status: 'approved', limit: 5, sort: 'downloads' }),
        resourceService.getResources({ uploadedBy: user?.id, status: 'pending', limit: 5 }),
      ]);
      const allData   = all.status      === 'fulfilled' ? all.value.data      : { data: [], pagination: { total: 0 } };
      const appData   = approved.status === 'fulfilled' ? approved.value.data  : { data: [] };
      const pendData  = pending.status  === 'fulfilled' ? pending.value.data   : { data: [] };
      const totalDown = (appData.data || []).reduce((s, r) => s + (r.download_count || 0), 0);
      setData({ total: allData.pagination?.total || 0, approved: appData.data || [], pending: pendData.data || [], totalDownloads: totalDown });
    };
    if (user?.id) load();
  }, [user?.id]);

  if (!data) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.first_name}!</h1>
        <p className="text-emerald-100 mt-1 text-sm">Faculty — {user?.department_name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Uploaded"   value={data.total}                icon={Library}     color="blue"   />
        <StatCard title="Approved"         value={data.approved.length}      icon={CheckCircle} color="green"  />
        <StatCard title="Pending Review"   value={data.pending.length}       icon={Clock}       color="orange" />
        <StatCard title="Total Downloads"  value={formatCount(data.totalDownloads)} icon={Download} color="purple" />
      </div>

      <div className="flex gap-3">
        <Link to="/faculty/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Upload className="w-4 h-4" /> Upload Resource
        </Link>
        <Link to="/faculty/resources" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Library className="w-4 h-4" /> My Resources
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Most Downloaded</h2>
            <Link to="/faculty/resources" className="text-xs text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {data.approved.length === 0 ? <p className="text-sm text-gray-400">No approved resources yet.</p> : (
            <div className="space-y-3">
              {data.approved.map(r => (
                <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                    <div className="flex gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Download className="w-3 h-3" />{formatCount(r.download_count)}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Eye className="w-3 h-3" />{formatCount(r.view_count)}</span>
                    </div>
                  </div>
                  <Badge label={capitalize(r.resource_type)} variant={r.resource_type} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Approval</h2>
          </div>
          {data.pending.length === 0 ? <p className="text-sm text-gray-400">All resources are reviewed!</p> : (
            <div className="space-y-3">
              {data.pending.map(r => (
                <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.created_at)}</p>
                  </div>
                  <Badge label="Pending" variant="pending" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
