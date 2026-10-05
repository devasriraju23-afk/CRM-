import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Edit, Trash2, Eye, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import { ConfirmModal } from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate, capitalize, formatCount } from '../../utils/formatters.js';
import * as resourceService from '../../services/resourceService.js';

export default function MyResources() {
  const { user } = useAuth();
  const toast = useToast();
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async (p=1) => {
    setLoading(true);
    try {
      const params = { uploadedBy: user?.id, page:p, limit:15, status: statusFilter||undefined };
      const res = await resourceService.getResources(params);
      setResources(res.data.data||[]); setPagination(res.data.pagination||{});
    } catch { toast.error('Failed to load resources.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.id) load(page); }, [page, statusFilter, user?.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await resourceService.deleteResource(deleteId);
      setDeleteId(null);
      toast.success('Resource deleted.');
      load(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Resources</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} resources</p>
        </div>
        <Link to="/faculty/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Upload className="w-4 h-4" /> Upload
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2">
        {['','pending','approved','rejected'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${statusFilter===s?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s ? capitalize(s) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : resources.length === 0 ? (
        <EmptyState icon={Upload} title="No resources found" description="Upload your first resource to get started." />
      ) : (
        <>
          <div className="card divide-y divide-gray-50">
            {resources.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge label={capitalize(r.resource_type)} variant={r.resource_type} />
                    <span className="text-xs text-gray-400">{r.department_name}</span>
                    <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                  <span className="flex items-center gap-1 hidden sm:flex"><Eye className="w-3.5 h-3.5" />{formatCount(r.view_count)}</span>
                  <span className="flex items-center gap-1 hidden sm:flex"><Download className="w-3.5 h-3.5" />{formatCount(r.download_count)}</span>
                  <Badge label={capitalize(r.status)} variant={r.status} />
                  <Link to={`/faculty/resources/${r.id}/edit`} className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-primary-600 transition-colors"><Edit className="w-4 h-4" /></Link>
                  <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting}
        title="Delete Resource" message="Are you sure you want to delete this resource? This action cannot be undone." confirmLabel="Delete" />
    </div>
  );
}
