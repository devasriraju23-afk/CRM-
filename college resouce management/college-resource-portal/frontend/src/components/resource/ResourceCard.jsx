import { Link } from 'react-router-dom';
import { Download, Eye, Bookmark, BookmarkCheck, FileText, Presentation, FileSpreadsheet, BookOpen, File } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { formatFileSize, formatCount, timeAgo, capitalize } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';

const typeIcon = {
  notes:           FileText,
  question_papers: FileText,
  assignments:     FileText,
  lab_manuals:     BookOpen,
  syllabus:        FileText,
  ebooks:          BookOpen,
  presentations:   Presentation,
  study_materials: FileText,
  other:           File,
};

export default function ResourceCard({ resource, onBookmark, isBookmarked }) {
  const { user } = useAuth();
  const basePath = user?.role === 'faculty' ? '/faculty' : user?.role === 'admin' ? '/admin' : '/student';
  const Icon = typeIcon[resource.resource_type] || File;

  return (
    <div className="card p-4 hover:shadow-card-hover transition-all duration-200 group flex flex-col gap-3">
      {/* Type icon + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <Badge label={capitalize(resource.resource_type)} variant={resource.resource_type} />
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <Link
          to={`${basePath}/resources/${resource.id}`}
          className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors"
        >
          {resource.title}
        </Link>
        {resource.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
        )}
      </div>

      {/* Meta */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">
          <span className="font-medium">{resource.department_name}</span>
          {resource.subject_name && <> · {resource.subject_name}</>}
          {resource.semester && <> · Sem {resource.semester}</>}
        </p>
        <p className="text-xs text-gray-400">
          {resource.uploader_first_name} {resource.uploader_last_name} · {timeAgo(resource.created_at)}
        </p>
      </div>

      {/* Tags */}
      {resource.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
          ))}
          {resource.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">+{resource.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer stats + actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatCount(resource.view_count)}</span>
          <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{formatCount(resource.download_count)}</span>
          <span className="text-gray-300">{resource.file_type?.toUpperCase()} · {formatFileSize(resource.file_size)}</span>
        </div>
        {onBookmark && user?.role === 'student' && (
          <button
            onClick={(e) => { e.preventDefault(); onBookmark(resource.id); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked
              ? <BookmarkCheck className="w-4 h-4 text-primary-600" />
              : <Bookmark className="w-4 h-4" />
            }
          </button>
        )}
      </div>
    </div>
  );
}
