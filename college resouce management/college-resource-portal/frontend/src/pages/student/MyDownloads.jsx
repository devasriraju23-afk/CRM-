import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import Badge from '../../components/common/Badge.jsx';
import { formatDateTime, formatFileSize, capitalize } from '../../utils/formatters.js';
import { MOCK_RESOURCES } from '../../services/mockData.js';

export default function MyDownloads() {
  const [downloads, setDownloads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mock: use resource list as download history
    const p = parseInt(page), l = 20;
    const downloads = MOCK_RESOURCES.filter(r=>r.status==='approved').map(r=>({...r, download_id:`dl_${r.id}`, downloaded_at: r.created_at}));
    setDownloads(downloads.slice((p-1)*l, p*l));
    setPagination({ total: downloads.length, page: p, limit: l, totalPages: Math.ceil(downloads.length/l)||1 });
    setLoading(false);
  }, [page]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Downloads</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} total downloads</p>
      </div>
      {downloads.length === 0 ? (
        <EmptyState icon={Download} title="No downloads yet" description="Resources you download will appear here." />
      ) : (
        <>
          <div className="card divide-y divide-gray-50">
            {downloads.map(d => (
              <div key={d.download_id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/student/resources/${d.id}`} className="text-sm font-medium text-gray-800 hover:text-primary-600 line-clamp-1">{d.title}</Link>
                  <p className="text-xs text-gray-400">{d.department_name} · {d.subject_name || 'General'}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge label={capitalize(d.resource_type)} variant={d.resource_type} />
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(d.downloaded_at)}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
