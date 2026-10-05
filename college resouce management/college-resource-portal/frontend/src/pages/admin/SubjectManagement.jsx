import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookMarked } from 'lucide-react';
import Modal, { ConfirmModal } from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as adminService from '../../services/adminService.js';

const empty = { name:'', code:'', departmentId:'', semester:'', credits:'' };

export default function SubjectManagement() {
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterDept, setFilterDept] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      adminService.getSubjects({ departmentId: filterDept || undefined }),
      adminService.getDepartments(),
    ]).then(([sRes, dRes]) => {
      setSubjects(sRes.data.data.subjects || []);
      setDepts(dRes.data.data.departments || []);
    }).finally(() => setLoading(false));
  };
  useEffect(load, [filterDept]);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') await adminService.createSubject(form);
      else await adminService.updateSubject(modal.id, form);
      toast.success('Subject saved.'); setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await adminService.deleteSubject(deleteId); toast.success('Subject deleted.'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Subjects</h1>
        <button onClick={() => { setForm(empty); setModal('create'); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
        <option value="">All Departments</option>
        {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      {loading ? <PageLoader /> : subjects.length === 0 ? (
        <EmptyState icon={BookMarked} title="No subjects found" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 font-medium">Semester</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Credits</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subjects.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">{s.code}</span></td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{s.department_code}</td>
                    <td className="px-4 py-3 text-gray-500">Sem {s.semester}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{s.credits || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setForm({ name:s.name, code:s.code, departmentId:s.department_id, semester:s.semester, credits:s.credits||'' }); setModal(s); }}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Add Subject' : 'Edit Subject'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
            <input required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input required value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
              <select required value={form.semester} onChange={e=>setForm(p=>({...p,semester:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select required value={form.departmentId} onChange={e=>setForm(p=>({...p,departmentId:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select</option>
                {depts.map(d=><option key={d.id} value={d.id}>{d.code}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
              <input type="number" min="1" max="10" value={form.credits} onChange={e=>setForm(p=>({...p,credits:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />} Save
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Subject" message="Delete this subject?" confirmLabel="Delete" />
    </div>
  );
}
