import { useState, useEffect } from 'react';
import { Trash2, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge.jsx';
import { ConfirmModal } from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate, capitalize, formatCount } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import * as resourceService from '../../services/resourceService.js';

export default function ResourceManagement() {
  const toast = useToast();
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async (p=1) => {
    setLoading(true);
    try {
      const res = await resourceService.getResources({ search: debouncedSearch||undefined, status: statusFilter||undefined, page:p, limit:20 });
      setResources(res.data.data||[]); setPagination(res.data.pagination||{});
    } catch { toast.error('Failed to load resources.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page, debouncedSearch, statusFilter]);

  const handleDelete = async () => {
    try { await resourceService.deleteResource(deleteId); toast.success('Resource deleted.'); setDeleteId(null); load(page); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Resource Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} total resources</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        {['','pending','approved','rejected'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${statusFilter===s?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s ? capitalize(s) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : resources.length === 0 ? (
        <EmptyState icon={Search} title="No resources found" />
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
                    <span className="text-xs text-gray-400">{r.uploader_first_name} {r.uploader_last_name}</span>
                    <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">{formatCount(r.download_count)} dl</span>
                  <Badge label={capitalize(r.status)} variant={r.status} />
                  <Link to={`/admin/resources/${r.id}`} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"><Eye className="w-4 h-4" /></Link>
                  <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Resource" message="Permanently delete this resource? This cannot be undone." confirmLabel="Delete" />
    </div>
  );
}
