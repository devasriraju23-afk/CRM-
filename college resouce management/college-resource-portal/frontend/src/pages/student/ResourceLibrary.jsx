import { useState, useEffect } from 'react';
import { Library } from 'lucide-react';
import ResourceCard from '../../components/resource/ResourceCard.jsx';
import ResourceFilters from '../../components/resource/ResourceFilters.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { SkeletonCard } from '../../components/common/Spinner.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import * as resourceService from '../../services/resourceService.js';
import * as bookmarkService from '../../services/bookmarkService.js';
import { getDepartments } from '../../services/adminService.js';
import { MOCK_DEPARTMENTS } from '../../services/mockData.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ResourceLibrary() {
  const toast = useToast();
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const [filters, setFilters] = useState({ search: '', department: '', semester: '', type: '', sort: 'newest', page: 1 });
  const debouncedSearch = useDebounce(filters.search, 400);

  useEffect(() => { getDepartments().then(r => setDepartments(r.data.data.departments || [])).catch(() => {}); }, []);
  useEffect(() => { bookmarkService.getBookmarks({ limit: 100 }).then(r => { const s={}; (r.data.data||[]).forEach(b=>{s[b.id]=true;}); setBookmarks(s); }).catch(()=>{}); }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { ...filters, search: debouncedSearch };
        const res = await resourceService.getResources(params);
        setResources(res.data.data || []);
        setPagination(res.data.pagination || {});
      } catch { toast.error('Failed to load resources.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [debouncedSearch, filters.department, filters.semester, filters.type, filters.sort, filters.page]);

  const handleBookmark = async (id) => {
    try {
      if (bookmarks[id]) { await bookmarkService.removeBookmark(id); setBookmarks(p => { const n={...p}; delete n[id]; return n; }); toast.success('Bookmark removed.'); }
      else { await bookmarkService.addBookmark(id); setBookmarks(p => ({ ...p, [id]: true })); toast.success('Bookmarked!'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Resource Library</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} resources available</p>
      </div>

      <ResourceFilters filters={filters} onChange={setFilters} departments={departments} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : resources.length === 0 ? (
        <EmptyState icon={Library} title="No resources found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(r => (
              <ResourceCard key={r.id} resource={r} onBookmark={handleBookmark} isBookmarked={!!bookmarks[r.id]} />
            ))}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={p => setFilters(f => ({ ...f, page: p }))} />
        </>
      )}
    </div>
  );
}
