import { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import * as adminService from '../../services/adminService.js';

export default function AdminNotifications() {
  const toast = useToast();
  const [form, setForm] = useState({ title:'', message:'', role:'', type:'admin_message' });
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault(); setSending(true);
    try {
      const res = await adminService.broadcastNotif(form);
      toast.success(`Notification sent to ${res.data.data.sentTo} users.`);
      setForm({ title:'', message:'', role:'', type:'admin_message' });
    } catch (err) { toast.error(err.response?.data?.message || 'Send failed.'); }
    finally { setSending(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Broadcast Notification</h1>
        <p className="text-sm text-gray-500 mt-0.5">Send notifications to all users or a specific role.</p>
      </div>

      <form onSubmit={handleSend} className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notification Title *</label>
          <input required value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g., Important Update"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea required value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={4} placeholder="Enter the notification message…"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Send To</label>
            <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">All Users</option>
              <option value="student">Students Only</option>
              <option value="faculty">Faculty Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="admin_message">Admin Message</option>
              <option value="announcement">Announcement</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Bell className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700">
            This notification will be sent to {form.role ? `all ${form.role}s` : 'all users'} on the platform.
          </p>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={sending}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
            {sending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            Send Notification
          </button>
        </div>
      </form>
    </div>
  );
}
