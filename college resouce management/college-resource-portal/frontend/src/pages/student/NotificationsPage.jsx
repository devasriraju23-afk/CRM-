import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { timeAgo } from '../../utils/formatters.js';
import * as notifService from '../../services/notificationService.js';
import { useToast } from '../../context/ToastContext.jsx';

const typeColor = { new_resource:'bg-blue-100 text-blue-600', approval:'bg-green-100 text-green-600', rejection:'bg-red-100 text-red-600', announcement:'bg-orange-100 text-orange-600', event:'bg-purple-100 text-purple-600', admin_message:'bg-gray-100 text-gray-600' };

export default function NotificationsPage() {
  const toast = useToast();
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p=1) => {
    setLoading(true);
    notifService.getNotifications({ page:p, limit:20 })
      .then(r => { setNotifs(r.data.data||[]); setUnreadCount(r.data.unreadCount||0); setPagination(r.data.pagination||{}); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const markAllRead = async () => {
    await notifService.markAllAsRead();
    setNotifs(p => p.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read.');
  };

  const markRead = async (id) => {
    await notifService.markAsRead(id);
    setNotifs(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>
      {notifs.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <>
          <div className="card divide-y divide-gray-50">
            {notifs.map(n => (
              <div key={n.id} onClick={() => !n.is_read && markRead(n.id)}
                className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${n.is_read ? 'hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${typeColor[n.type]||'bg-gray-100 text-gray-600'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.is_read?'text-gray-700':'text-gray-900'}`}>{n.title}</p>
                    {!n.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
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
