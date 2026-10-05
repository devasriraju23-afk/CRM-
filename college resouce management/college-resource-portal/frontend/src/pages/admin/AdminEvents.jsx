import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CalendarDays, MapPin } from 'lucide-react';
import Modal, { ConfirmModal } from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as eventService from '../../services/eventService.js';
import * as adminService from '../../services/adminService.js';

const empty = { name:'', description:'', eventDate:'', eventTime:'', venue:'', departmentId:'', organizer:'', registrationLink:'' };

export default function AdminEvents() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [depts, setDepts] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      eventService.getEvents({ upcoming: tab==='upcoming'?'true':'false', page, limit:12 }),
      adminService.getDepartments(),
    ]).then(([eRes, dRes]) => {
      setEvents(eRes.data.data||[]); setPagination(eRes.data.pagination||{});
      setDepts(dRes.data.data.departments||[]);
    }).finally(() => setLoading(false));
  };
  useEffect(load, [page, tab]);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') await eventService.createEvent(form);
      else await eventService.updateEvent(modal.id, form);
      toast.success('Saved.'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message||'Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await eventService.deleteEvent(deleteId); toast.success('Event deleted.'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.response?.data?.message||'Delete failed.'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Events</h1>
        <button onClick={() => { setForm(empty); setModal('create'); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="flex gap-2">
        {['upcoming','past'].map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : events.length === 0 ? (
        <EmptyState icon={CalendarDays} title={`No ${tab} events`} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(e => (
              <div key={e.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <p className="text-xs font-bold text-primary-600">{new Date(e.event_date).getDate()}</p>
                      <p className="text-xs text-primary-400">{new Date(e.event_date).toLocaleString('en',{month:'short'})}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{e.name}</p>
                      {e.venue && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{e.venue}</p>}
                      {e.department_name && <p className="text-xs text-gray-400">{e.department_name}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setForm({ name:e.name, description:e.description||'', eventDate:e.event_date, eventTime:e.event_time||'', venue:e.venue||'', departmentId:e.department_id||'', organizer:e.organizer||'', registrationLink:e.registration_link||'' }); setModal(e); }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal==='create'?'Add Event':'Edit Event'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
            <input required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input required type="date" value={form.eventDate} onChange={e=>setForm(p=>({...p,eventDate:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" value={form.eventTime} onChange={e=>setForm(p=>({...p,eventTime:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input value={form.venue} onChange={e=>setForm(p=>({...p,venue:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
              <input value={form.organizer} onChange={e=>setForm(p=>({...p,organizer:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select value={form.departmentId} onChange={e=>setForm(p=>({...p,departmentId:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All</option>
                {depts.map(d=><option key={d.id} value={d.id}>{d.code}</option>)}
              </select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
            <input type="url" value={form.registrationLink} onChange={e=>setForm(p=>({...p,registrationLink:e.target.value}))} placeholder="https://" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />} Save
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Event" message="Delete this event?" confirmLabel="Delete" />
    </div>
  );
}
