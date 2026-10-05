import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Library, Bookmark, Download, Bell, ArrowRight, Megaphone, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import ResourceCard from '../../components/resource/ResourceCard.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate } from '../../utils/formatters.js';
import * as resourceService from '../../services/resourceService.js';
import * as bookmarkService from '../../services/bookmarkService.js';
import * as announcementService from '../../services/announcementService.js';
import * as eventService from '../../services/eventService.js';
import * as notifService from '../../services/notificationService.js';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    const load = async () => {
      const [recent, popular, announcements, events, notifs, myBookmarks] = await Promise.allSettled([
        resourceService.getResources({ sort: 'newest', limit: 6 }),
        resourceService.getResources({ sort: 'downloads', limit: 4 }),
        announcementService.getAnnouncements({ limit: 4 }),
        eventService.getEvents({ upcoming: 'true', limit: 4 }),
        notifService.getNotifications({ unread: 'true', limit: 5 }),
        bookmarkService.getBookmarks({ limit: 100 }),
      ]);
      const bkSet = {};
      if (myBookmarks.status === 'fulfilled') {
        (myBookmarks.value.data.data || []).forEach(b => { bkSet[b.id] = true; });
      }
      setBookmarks(bkSet);
      setData({
        recent:        recent.status === 'fulfilled'        ? recent.value.data.data : [],
        popular:       popular.status === 'fulfilled'       ? popular.value.data.data : [],
        announcements: announcements.status === 'fulfilled' ? announcements.value.data.data : [],
        events:        events.status === 'fulfilled'        ? events.value.data.data : [],
        unreadCount:   notifs.status === 'fulfilled'        ? notifs.value.data.unreadCount : 0,
        totalBk:       myBookmarks.status === 'fulfilled'   ? myBookmarks.value.data.pagination?.total : 0,
      });
    };
    load();
  }, []);

  const handleBookmark = async (id) => {
    if (bookmarks[id]) {
      await bookmarkService.removeBookmark(id);
      setBookmarks(p => { const n={...p}; delete n[id]; return n; });
    } else {
      await bookmarkService.addBookmark(id);
      setBookmarks(p => ({ ...p, [id]: true }));
    }
  };

  if (!data) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Good day, {user?.first_name}! 👋</h1>
        <p className="text-primary-100 mt-1 text-sm">{user?.department_name} · Semester {user?.semester}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Bookmarks"   value={data.totalBk}     icon={Bookmark}  color="blue"   />
        <StatCard title="Notifications"  value={data.unreadCount} icon={Bell}      color="orange" subtitle="Unread" />
        <StatCard title="Upcoming Events" value={data.events.length} icon={CalendarDays} color="green" />
        <StatCard title="Announcements"  value={data.announcements.length} icon={Megaphone} color="purple" />
      </div>

      {/* Recent resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recently Added</h2>
          <Link to="/student/resources" className="flex items-center gap-1 text-sm text-primary-600 hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.recent.map(r => (
            <ResourceCard key={r.id} resource={r} onBookmark={handleBookmark} isBookmarked={!!bookmarks[r.id]} />
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary-500" />Announcements</h2>
            <Link to="/student/announcements" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {data.announcements.length === 0 && <p className="text-sm text-gray-400">No announcements.</p>}
            {data.announcements.map(a => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${a.priority==='urgent'?'bg-red-500':a.priority==='important'?'bg-orange-500':'bg-blue-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.published_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary-500" />Upcoming Events</h2>
            <Link to="/student/events" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {data.events.length === 0 && <p className="text-sm text-gray-400">No upcoming events.</p>}
            {data.events.map(e => (
              <div key={e.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 text-center">
                  <p className="text-xs font-bold text-primary-600 leading-none">{new Date(e.event_date).toLocaleDateString('en',{day:'2-digit',month:'short'}).split(' ').join('\n')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
