import { useState, useEffect } from 'react';
import { CalendarDays, MapPin, ExternalLink, Clock } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate } from '../../utils/formatters.js';
import * as eventService from '../../services/eventService.js';

export default function EventsPage() {
  const [tab, setTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    eventService.getEvents({ upcoming: tab === 'upcoming' ? 'true' : 'false', page, limit: 12 })
      .then(r => { setEvents(r.data.data || []); setPagination(r.data.pagination || {}); })
      .finally(() => setLoading(false));
  }, [tab, page]);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Events</h1>
      <div className="flex gap-2">
        {['upcoming','past'].map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>
      {loading ? <PageLoader /> : events.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events" description={`No ${tab} events found.`} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(e => (
              <div key={e.id} className="card p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <p className="text-xs font-bold text-primary-600 leading-none">{new Date(e.event_date).getDate()}</p>
                    <p className="text-xs text-primary-400">{new Date(e.event_date).toLocaleString('en',{month:'short'})}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{e.name}</h3>
                    {e.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{e.description}</p>}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {e.venue && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" />{e.venue}</span>}
                      {e.event_time && <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" />{e.event_time}</span>}
                      {e.organizer && <span className="text-xs text-gray-400">{e.organizer}</span>}
                    </div>
                    {e.registration_link && (
                      <a href={e.registration_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-2">
                        Register <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
