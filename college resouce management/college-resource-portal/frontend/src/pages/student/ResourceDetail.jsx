import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Bookmark, BookmarkCheck, Eye, ArrowLeft, Tag, Calendar, Building2, BookOpen, FileText, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Spinner.jsx';
import { formatDate, formatFileSize, formatCount, capitalize } from '../../utils/formatters.js';
import * as resourceService from '../../services/resourceService.js';
import * as bookmarkService from '../../services/bookmarkService.js';

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    resourceService.getResourceById(id)
      .then(r => { setResource(r.data.data.resource); setIsBookmarked(r.data.data.resource.is_bookmarked || false); })
      .catch(() => toast.error('Resource not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await resourceService.downloadResource(id);
      const fileUrl = res.data.data.fileUrl;
      const a = document.createElement('a');
      a.href = fileUrl; a.download = resource.title; a.target = '_blank';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setResource(p => ({ ...p, download_count: (p.download_count || 0) + 1 }));
      toast.success('Download started.');
    } catch (err) { toast.error(err.response?.data?.message || 'Download failed.'); }
    finally { setDownloading(false); }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) { await bookmarkService.removeBookmark(id); setIsBookmarked(false); toast.success('Bookmark removed.'); }
      else { await bookmarkService.addBookmark(id); setIsBookmarked(true); toast.success('Bookmarked!'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed.'); }
  };

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard!'); };

  if (loading) return <PageLoader />;
  if (!resource) return <div className="text-center py-20 text-gray-400">Resource not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{resource.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge label={capitalize(resource.resource_type)} variant={resource.resource_type} />
                <Badge label={capitalize(resource.status)} variant={resource.status} />
                {resource.file_type && <span className="text-xs text-gray-400 uppercase">{resource.file_type}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={handleDownload} disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors">
            {downloading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
            Download
          </button>
          {user?.role === 'student' && (
            <button onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-primary-600" /> : <Bookmark className="w-4 h-4" />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          )}
          <button onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        {/* Description */}
        {resource.description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Building2,  label: 'Department', value: resource.department_name },
            { icon: BookOpen,   label: 'Subject',    value: resource.subject_name || '—' },
            { icon: FileText,   label: 'Semester',   value: resource.semester ? `Semester ${resource.semester}` : '—' },
            { icon: Calendar,   label: 'Uploaded',   value: formatDate(resource.created_at) },
            { icon: Eye,        label: 'Views',      value: formatCount(resource.view_count) },
            { icon: Download,   label: 'Downloads',  value: formatCount(resource.download_count) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Icon className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Uploader */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-primary-700">
              {resource.uploader_first_name?.[0]}{resource.uploader_last_name?.[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{resource.uploader_first_name} {resource.uploader_last_name}</p>
            <p className="text-xs text-gray-400">File size: {formatFileSize(resource.file_size)}</p>
          </div>
        </div>

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
            {resource.tags.map(t => (
              <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
