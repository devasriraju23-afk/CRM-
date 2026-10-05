import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate } from '../../utils/formatters.js';
import * as announcementService from '../../services/announcementService.js';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    announcementService.getAnnouncements({ page, limit: 15 })
      .then(r => { setAnnouncements(r.data.data || []); setPagination(r.data.pagination || {}); })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Announcements</h1>
      {announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" description="Check back later for updates." />
      ) : (
        <>
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${a.priority==='urgent'?'bg-red-500':a.priority==='important'?'bg-orange-500':'bg-blue-400'}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{a.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <Badge label={a.priority.charAt(0).toUpperCase()+a.priority.slice(1)} variant={a.priority} />
                        {a.department_name && <span className="text-xs text-gray-400">{a.department_name}</span>}
                        <span className="text-xs text-gray-400">{formatDate(a.published_at)}</span>
                        <span className="text-xs text-gray-400">By {a.author_first_name} {a.author_last_name}</span>
                      </div>
                    </div>
                  </div>
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
