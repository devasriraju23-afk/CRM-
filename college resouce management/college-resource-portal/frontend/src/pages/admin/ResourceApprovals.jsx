import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import Modal from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate, capitalize, formatFileSize } from '../../utils/formatters.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as adminService from '../../services/adminService.js';

export default function ResourceApprovals() {
  const toast = useToast();
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, totalPages:1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const load = async (p=1) => {
    setLoading(true);
    try {
      const res = await adminService.getPendingResources({ status: statusFilter, page:p, limit:15 });
      setResources(res.data.data||[]); setPagination(res.data.pagination||{});
    } catch { toast.error('Failed to load resources.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page, statusFilter]);

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      await adminService.approveResource(id);
      toast.success('Resource approved!');
      setResources(p => p.filter(r => r.id !== id));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setProcessing(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Please enter a rejection reason.'); return; }
    setProcessing(true);
    try {
      await adminService.rejectResource(rejectModal, rejectReason);
      toast.success('Resource rejected.');
      setRejectModal(null); setRejectReason('');
      setResources(p => p.filter(r => r.id !== rejectModal));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
    finally { setProcessing(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Resource Approvals</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pagination.total || 0} resources</p>
      </div>

      <div className="flex gap-2">
        {['pending','approved','rejected'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${statusFilter===s?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {capitalize(s)}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : resources.length === 0 ? (
        <EmptyState icon={Clock} title={`No ${statusFilter} resources`} description={statusFilter==='pending'?'All resources have been reviewed!':'No resources found.'} />
      ) : (
        <>
          <div className="card divide-y divide-gray-50">
            {resources.map(r => (
              <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{r.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <Badge label={capitalize(r.resource_type)} variant={r.resource_type} />
                      <span className="text-xs text-gray-500">{r.department_name}</span>
                      <span className="text-xs text-gray-400">{r.uploader_first_name} {r.uploader_last_name}</span>
                      <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                      <span className="text-xs text-gray-400">{r.file_type?.toUpperCase()} · {formatFileSize(r.file_size)}</span>
                    </div>
                    {r.rejection_reason && (
                      <p className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">Reason: {r.rejection_reason}</p>
                    )}
                  </div>
                  {statusFilter === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleApprove(r.id)} disabled={processing}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => setRejectModal(r.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }} title="Reject Resource" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Please provide a reason for rejecting this resource. The uploader will be notified.</p>
          <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Enter rejection reason…"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          <div className="flex justify-end gap-3">
            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleReject} disabled={processing}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors">
              {processing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Confirm Reject
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
