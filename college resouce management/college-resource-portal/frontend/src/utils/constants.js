export const RESOURCE_TYPES = [
  { value: 'notes',           label: 'Notes' },
  { value: 'question_papers', label: 'Question Papers' },
  { value: 'assignments',     label: 'Assignments' },
  { value: 'lab_manuals',     label: 'Lab Manuals' },
  { value: 'syllabus',        label: 'Syllabus' },
  { value: 'ebooks',          label: 'E-Books' },
  { value: 'presentations',   label: 'Presentations' },
  { value: 'study_materials', label: 'Study Materials' },
  { value: 'other',           label: 'Other' },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const RESOURCE_STATUS = {
  PENDING:  'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const ANNOUNCEMENT_PRIORITY = {
  NORMAL:    'normal',
  IMPORTANT: 'important',
  URGENT:    'urgent',
};

export const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN:   'admin',
};

export const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'oldest',    label: 'Oldest First' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'views',     label: 'Most Viewed' },
  { value: 'title',     label: 'Alphabetical' },
];

export const ITEMS_PER_PAGE = 20;
