import { useState } from 'react';
import { User, Mail, Building2, Hash, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as authService from '../../services/authService.js';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ firstName: user?.first_name||'', lastName: user?.last_name||'', phone: user?.phone||'', bio: user?.bio||'', semester: user?.semester||'' });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'' });
  const [saving, setSaving] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await authService.updateMe({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, bio: form.bio, semester: form.semester || undefined });
      updateUser({ ...user, ...res.data.data.user });
      toast.success('Profile updated.');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed.'); }
    finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await authService.changePassword(pwForm);
      setPwForm({ currentPassword:'', newPassword:'' });
      toast.success('Password changed successfully.');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

      {/* Avatar card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-700">{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{user?.first_name} {user?.last_name}</h2>
          <p className="text-sm text-gray-500 capitalize">{user?.role} · {user?.department_name || 'No department'}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['profile','password'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleProfile} className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input value={form.firstName} onChange={e => setForm(p=>({...p,firstName:e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(p=>({...p,lastName:e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 99999 99999"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p=>({...p,bio:e.target.value}))} rows={3} placeholder="Tell us about yourself…"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          {user?.role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select value={form.semester} onChange={e => setForm(p=>({...p,semester:e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          )}
          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" required value={pwForm.currentPassword} onChange={e => setPwForm(p=>({...p,currentPassword:e.target.value}))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" required value={pwForm.newPassword} onChange={e => setPwForm(p=>({...p,newPassword:e.target.value}))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Min 8 chars, 1 uppercase, 1 number" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
              {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              Change Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
