const variants = {
  pending:   'bg-amber-100  text-amber-700',
  approved:  'bg-green-100  text-green-700',
  rejected:  'bg-red-100    text-red-700',
  normal:    'bg-blue-100   text-blue-700',
  important: 'bg-orange-100 text-orange-700',
  urgent:    'bg-red-100    text-red-700',
  student:   'bg-sky-100    text-sky-700',
  faculty:   'bg-violet-100 text-violet-700',
  admin:     'bg-rose-100   text-rose-700',
  notes:         'bg-blue-100   text-blue-700',
  question_papers:'bg-purple-100 text-purple-700',
  assignments:   'bg-orange-100 text-orange-700',
  lab_manuals:   'bg-teal-100   text-teal-700',
  syllabus:      'bg-green-100  text-green-700',
  ebooks:        'bg-indigo-100 text-indigo-700',
  presentations: 'bg-pink-100   text-pink-700',
  study_materials:'bg-yellow-100 text-yellow-700',
  other:         'bg-gray-100   text-gray-600',
  default:   'bg-gray-100   text-gray-600',
};

export default function Badge({ label, variant = 'default', className = '' }) {
  const cls = variants[variant] || variants.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls} ${className}`}>
      {label}
    </span>
  );
}
