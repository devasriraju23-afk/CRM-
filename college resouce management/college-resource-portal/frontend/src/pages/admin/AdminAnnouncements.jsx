import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Megaphone } from 'lucide-react';
import Modal, { ConfirmModal } from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as announcementService from '../../services/announcementService.js';
import * as adminService from '../../services/adminService.js';

const empty = { title:'', description:'', departmentId:'', priority:'normal', expiresAt:'' };

export default function AdminAnnouncements() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [depts, setDepts] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      announcementService.getAnnouncements({ page, limit:15 }),
      adminService.getDepartments(),
    ]).then(([aRes, dRes]) => {
      setItems(aRes.data.data||[]); setPagination(aRes.data.pagination||{});
      setDepts(dRes.data.data.departments||[]);
    }).finally(() => setLoading(false));
  };
  useEffect(load, [page]);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') await announcementService.createAnnouncement(form);
      else await announcementService.updateAnnouncement(modal.id, form);
      toast.success('Saved.'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await announcementService.deleteAnnouncement(deleteId); toast.success('Deleted.'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.response?.data?.message||'Delete failed.'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Announcements</h1>
        <button onClick={() => { setForm(empty); setModal('create'); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {loading ? <PageLoader /> : items.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" />
      ) : (
        <>
          <div className="space-y-3">
            {items.map(a => (
              <div key={a.id} className="card p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <Badge label={a.priority.charAt(0).toUpperCase()+a.priority.slice(1)} variant={a.priority} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span>{formatDate(a.published_at)}</span>
                    {a.department_name && <span>{a.department_name}</span>}
                    {a.expires_at && <span>Expires {formatDate(a.expires_at)}</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setForm({ title:a.title, description:a.description, departmentId:a.department_id||'', priority:a.priority, expiresAt:a.expires_at?a.expires_at.split('T')[0]:'' }); setModal(a); }}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'New Announcement' : 'Edit Announcement'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="normal">Normal</option><option value="important">Important</option><option value="urgent">Urgent</option>
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select value={form.departmentId} onChange={e=>setForm(p=>({...p,departmentId:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Departments</option>
                {depts.map(d=><option key={d.id} value={d.id}>{d.code}</option>)}
              </select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (optional)</label>
            <input type="date" value={form.expiresAt} onChange={e=>setForm(p=>({...p,expiresAt:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />} Save
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Announcement" message="Delete this announcement?" confirmLabel="Delete" />
    </div>
  );
}
