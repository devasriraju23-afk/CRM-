import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { RESOURCE_TYPES, SEMESTERS } from '../../utils/constants.js';
import { formatFileSize } from '../../utils/formatters.js';
import * as resourceService from '../../services/resourceService.js';
import { getDepartments, getSubjects } from '../../services/adminService.js';

export default function UploadResource() {
  const toast = useToast();
  const navigate = useNavigate();
  const [depts, setDepts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', resourceType:'notes', departmentId:'', subjectId:'', semester:'', category:'', tags:'' });

  useEffect(() => { getDepartments().then(r => setDepts(r.data.data.departments || [])).catch(()=>{}); }, []);
  useEffect(() => {
    if (!form.departmentId) { setSubjects([]); return; }
    getSubjects({ departmentId: form.departmentId })
      .then(r => setSubjects(r.data.data.subjects || [])).catch(()=>{});
  }, [form.departmentId, form.semester]);

  const set = (k,v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file to upload.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (v) fd.append(k, v); });
      fd.append('file', file);
      await resourceService.createResource(fd);
      toast.success('Resource uploaded! Awaiting admin approval.');
      navigate('/faculty/resources');
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Upload Resource</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={e=>set('title',e.target.value)} maxLength={300} placeholder="e.g., Data Structures Complete Notes"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3} maxLength={2000} placeholder="Brief description of the resource content…"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        </div>

        {/* Type + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type <span className="text-red-500">*</span></label>
            <select required value={form.resourceType} onChange={e=>set('resourceType',e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              {RESOURCE_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input value={form.category} onChange={e=>set('category',e.target.value)} placeholder="e.g., Core Subject"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {/* Department + Semester */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
            <select required value={form.departmentId} onChange={e=>set('departmentId',e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select department</option>
              {depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select value={form.semester} onChange={e=>set('semester',e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">All semesters</option>
              {SEMESTERS.map(s=><option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>

        {/* Subject */}
        {subjects.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select value={form.subjectId} onChange={e=>set('subjectId',e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select subject</option>
              {subjects.map(s=><option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="Comma separated: DSA, algorithms, arrays"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File <span className="text-red-500">*</span></label>
          {file ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="w-5 h-5 text-green-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button type="button" onClick={()=>setFile(null)} className="text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, Images — Max 50 MB</p>
              <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp" />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/faculty/resources')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Resource
          </button>
        </div>
      </form>
    </div>
  );
}
