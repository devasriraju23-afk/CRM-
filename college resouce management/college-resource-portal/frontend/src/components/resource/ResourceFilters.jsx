import { Search, Filter, X } from 'lucide-react';
import { Select } from '../common/Input.jsx';
import { RESOURCE_TYPES, SEMESTERS, SORT_OPTIONS } from '../../utils/constants.js';

export default function ResourceFilters({ filters, onChange, departments, subjects }) {
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 });
  const clear = () => onChange({ search: '', department: '', semester: '', subject: '', type: '', sort: 'newest', page: 1 });
  const hasFilters = filters.department || filters.semester || filters.subject || filters.type || filters.search;

  return (
    <div className="card p-4 space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title, subject, tags…"
          value={filters.search || ''}
          onChange={(e) => set('search', e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {filters.search && (
          <button onClick={() => set('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <Select value={filters.department || ''} onChange={(e) => set('department', e.target.value)}>
          <option value="">All Departments</option>
          {departments?.map((d) => <option key={d.id} value={d.id}>{d.code}</option>)}
        </Select>
        <Select value={filters.semester || ''} onChange={(e) => set('semester', e.target.value)}>
          <option value="">All Semesters</option>
          {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
        </Select>
        <Select value={filters.type || ''} onChange={(e) => set('type', e.target.value)}>
          <option value="">All Types</option>
          {RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
        <Select value={filters.sort || 'newest'} onChange={(e) => set('sort', e.target.value)}>
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
        {hasFilters && (
          <button onClick={clear} className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-red-600 border border-gray-300 rounded-lg px-3 py-2 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
