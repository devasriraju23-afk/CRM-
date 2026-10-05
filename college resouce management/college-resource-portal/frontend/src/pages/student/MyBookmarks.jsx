import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import ResourceCard from '../../components/resource/ResourceCard.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as bookmarkService from '../../services/bookmarkService.js';

export default function MyBookmarks() {
  const toast = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await bookmarkService.getBookmarks({ page: p, limit: 12 });
      setBookmarks(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load bookmarks.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const handleRemove = async (id) => {
    try {
      await bookmarkService.removeBookmark(id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
      toast.success('Bookmark removed.');
    } catch { toast.error('Failed to remove bookmark.'); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Bookmarks</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} saved resources</p>
      </div>
      {bookmarks.length === 0 ? (
        <EmptyState icon={Bookmark} title="No bookmarks yet" description="Bookmark resources from the library to save them here." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map(b => (
              <ResourceCard key={b.id} resource={b} onBookmark={handleRemove} isBookmarked={true} />
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
