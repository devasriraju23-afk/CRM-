import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal, { ConfirmModal } from '../../components/common/Modal.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as adminService from '../../services/adminService.js';
import { Building2 } from 'lucide-react';

const empty = { name:'', code:'', description:'', hodName:'' };

export default function DepartmentManagement() {
  const toast = useToast();
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | dept object
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => { setLoading(true); adminService.getDepartments().then(r => setDepts(r.data.data.departments||[])).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const openEdit = (d) => { setForm({ name:d.name, code:d.code, description:d.description||'', hodName:d.hod_name||'' }); setModal(d); };
  const openCreate = () => { setForm(empty); setModal('create'); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'create') await adminService.createDepartment(form);
      else await adminService.updateDepartment(modal.id, form);
      toast.success(modal === 'create' ? 'Department created.' : 'Department updated.');
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await adminService.deleteDepartment(deleteId); toast.success('Department deleted.'); setDeleteId(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed.'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Departments</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {loading ? <PageLoader /> : depts.length === 0 ? (
        <EmptyState icon={Building2} title="No departments" action={<button onClick={openCreate} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg">Add First Department</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {depts.map(d => (
            <div key={d.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded">{d.code}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{d.name}</h3>
                  {d.hod_name && <p className="text-xs text-gray-500 mt-0.5">HOD: {d.hod_name}</p>}
                  {d.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{d.description}</p>}
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>{d.student_count || 0} students</span>
                    <span>{d.faculty_count || 0} faculty</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(d.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Add Department' : 'Edit Department'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          {[['name','Department Name',true],['code','Code (e.g. CSE)',true],['hodName','Head of Department',false],['description','Description',false]].map(([k,lbl,req])=>(
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lbl}{req&&<span className="text-red-500 ml-0.5">*</span>}</label>
              {k==='description'
                ? <textarea value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} rows={2} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                : <input required={req} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              }
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />} Save
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Department" message="Delete this department? This may fail if users are assigned to it." confirmLabel="Delete" />
    </div>
  );
}
