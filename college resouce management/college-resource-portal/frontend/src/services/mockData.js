// ── Mock data for running the frontend without a backend ──────────────────────

export const MOCK_USERS = {
  'admin@eduvault.edu': {
    id: 'a1b2c3d4-0000-0000-0000-000000000001',
    email: 'admin@eduvault.edu',
    role: 'admin',
    first_name: 'System',
    last_name: 'Admin',
    department_name: 'Computer Science & Engineering',
    department_code: 'CSE',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  'faculty.cs@eduvault.edu': {
    id: 'a1b2c3d4-0000-0000-0000-000000000002',
    email: 'faculty.cs@eduvault.edu',
    role: 'faculty',
    first_name: 'Deepak',
    last_name: 'Verma',
    department_name: 'Computer Science & Engineering',
    department_code: 'CSE',
    employee_id: 'FAC001',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  'student1@eduvault.edu': {
    id: 'a1b2c3d4-0000-0000-0000-000000000003',
    email: 'student1@eduvault.edu',
    role: 'student',
    first_name: 'Arjun',
    last_name: 'Mehta',
    department_name: 'Computer Science & Engineering',
    department_code: 'CSE',
    semester: 5,
    roll_number: 'CS21001',
    is_active: true,
    created_at: new Date().toISOString(),
  },
};

export const MOCK_DEPARTMENTS = [
  { id: 'd1', name: 'Computer Science & Engineering', code: 'CSE', hod_name: 'Dr. Ramesh Kumar', student_count: 120, faculty_count: 8, is_active: true },
  { id: 'd2', name: 'Electronics & Communication Engg', code: 'ECE', hod_name: 'Dr. Priya Sharma', student_count: 95, faculty_count: 7, is_active: true },
  { id: 'd3', name: 'Mechanical Engineering', code: 'MECH', hod_name: 'Dr. Arun Patel', student_count: 80, faculty_count: 6, is_active: true },
  { id: 'd4', name: 'Civil Engineering', code: 'CIVIL', hod_name: 'Dr. Lakshmi Iyer', student_count: 60, faculty_count: 5, is_active: true },
  { id: 'd5', name: 'Electrical Engineering', code: 'EEE', hod_name: 'Dr. Suresh Nair', student_count: 75, faculty_count: 6, is_active: true },
  { id: 'd6', name: 'Information Technology', code: 'IT', hod_name: 'Dr. Anitha Reddy', student_count: 100, faculty_count: 7, is_active: true },
  { id: 'd7', name: 'Mathematics', code: 'MATH', hod_name: 'Dr. Vijay Gopal', student_count: 40, faculty_count: 4, is_active: true },
  { id: 'd8', name: 'Physics', code: 'PHY', hod_name: 'Dr. Meena Krishnan', student_count: 30, faculty_count: 3, is_active: true },
];

export const MOCK_RESOURCES = [
  { id: 'r1', title: 'Data Structures Complete Notes', description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, sorting and searching algorithms.', resource_type: 'notes', category: 'Core Subject', semester: 3, file_url: '#', file_type: 'pdf', file_size: 2456789, department_id: 'd1', department_name: 'CSE', department_code: 'CSE', subject_name: 'Data Structures & Algorithms', subject_id: 's1', uploader_first_name: 'Deepak', uploader_last_name: 'Verma', status: 'approved', download_count: 245, view_count: 890, tags: ['DSA', 'algorithms', 'data structures'], created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'r2', title: 'DBMS Previous Year Question Papers (2019–2023)', description: 'Collection of previous year exam papers for DBMS with answer keys.', resource_type: 'question_papers', category: 'Exam Preparation', semester: 3, file_url: '#', file_type: 'pdf', file_size: 1234567, department_id: 'd1', department_name: 'CSE', department_code: 'CSE', subject_name: 'Database Management Systems', subject_id: 's2', uploader_first_name: 'Deepak', uploader_last_name: 'Verma', status: 'approved', download_count: 312, view_count: 1120, tags: ['DBMS', 'SQL', 'exam'], created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'r3', title: 'Operating Systems Lab Manual', description: 'Complete lab manual for OS practicals including process scheduling and memory management.', resource_type: 'lab_manuals', category: 'Practical', semester: 4, file_url: '#', file_type: 'pdf', file_size: 3456789, department_id: 'd1', department_name: 'CSE', department_code: 'CSE', subject_name: 'Operating Systems', subject_id: 's3', uploader_first_name: 'Deepak', uploader_last_name: 'Verma', status: 'approved', download_count: 178, view_count: 650, tags: ['OS', 'lab', 'Linux'], created_at: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 'r4', title: 'Machine Learning Lecture Slides — Unit 1 to 5', description: 'PowerPoint presentations covering supervised learning, neural networks, SVM, and model evaluation.', resource_type: 'presentations', category: 'Lecture Material', semester: 5, file_url: '#', file_type: 'pptx', file_size: 8765432, department_id: 'd1', department_name: 'CSE', department_code: 'CSE', subject_name: 'Machine Learning', subject_id: 's4', uploader_first_name: 'Deepak', uploader_last_name: 'Verma', status: 'approved', download_count: 420, view_count: 1540, tags: ['ML', 'neural networks', 'AI'], created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'r5', title: 'Computer Networks Syllabus', description: 'Official syllabus for Computer Networks including unit-wise topics and reference books.', resource_type: 'syllabus', category: 'Official', semester: 4, file_url: '#', file_type: 'pdf', file_size: 345678, department_id: 'd1', department_name: 'CSE', department_code: 'CSE', subject_name: 'Computer Networks', subject_id: 's5', uploader_first_name: 'System', uploader_last_name: 'Admin', status: 'approved', download_count: 189, view_count: 720, tags: ['networks', 'TCP/IP', 'syllabus'], created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: 'r6', title: 'Digital Signal Processing Notes — Complete', description: 'Full semester notes for DSP covering DFT, FFT, digital filters, Z-transform and applications.', resource_type: 'notes', category: 'Core Subject', semester: 3, file_url: '#', file_type: 'pdf', file_size: 4567890, department_id: 'd2', department_name: 'ECE', department_code: 'ECE', subject_name: 'Digital Signal Processing', subject_id: 's6', uploader_first_name: 'Kavitha', uploader_last_name: 'Murthy', status: 'approved', download_count: 156, view_count: 580, tags: ['DSP', 'signals', 'FFT'], created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'r7', title: 'Engineering Thermodynamics E-Book', description: 'Comprehensive e-book on thermodynamics covering laws, cycles, refrigeration and AC.', resource_type: 'ebooks', category: 'Reference', semester: 3, file_url: '#', file_type: 'pdf', file_size: 12345678, department_id: 'd3', department_name: 'MECH', department_code: 'MECH', subject_name: 'Engineering Thermodynamics', subject_id: 's7', uploader_first_name: 'Rajesh', uploader_last_name: 'Singh', status: 'approved', download_count: 203, view_count: 760, tags: ['thermodynamics', 'ebook', 'mechanical'], created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 'r8', title: 'Probability & Statistics Study Material', description: 'Study material covering probability distributions, statistical inference, hypothesis testing.', resource_type: 'study_materials', category: 'Study Aid', semester: 3, file_url: '#', file_type: 'pdf', file_size: 3456123, department_id: 'd7', department_name: 'MATH', department_code: 'MATH', subject_name: 'Probability & Statistics', subject_id: 's8', uploader_first_name: 'System', uploader_last_name: 'Admin', status: 'approved', download_count: 267, view_count: 940, tags: ['statistics', 'probability', 'math'], created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: 'r9', title: 'Software Engineering — Pending Review', description: 'Notes on SDLC, agile methodologies, UML diagrams, and testing strategies.', resource_type: 'notes', category: 'Core Subject', semester: 5, file_url: '#', file_type: 'pdf', file_size: 2134567, department_id: 'd1', department_name: 'CSE', department_code: 'CSE', subject_name: 'Software Engineering', subject_id: 's9', uploader_first_name: 'Deepak', uploader_last_name: 'Verma', status: 'pending', download_count: 0, view_count: 0, tags: ['SE', 'agile', 'UML'], created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'r10', title: 'VLSI Design Assignment — Unit 3', description: 'Assignment problems on CMOS logic design, timing analysis, and layout verification.', resource_type: 'assignments', category: 'Assignment', semester: 5, file_url: '#', file_type: 'pdf', file_size: 678901, department_id: 'd2', department_name: 'ECE', department_code: 'ECE', subject_name: 'VLSI Design', subject_id: 's10', uploader_first_name: 'Kavitha', uploader_last_name: 'Murthy', status: 'approved', download_count: 89, view_count: 320, tags: ['VLSI', 'CMOS', 'assignment'], created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
];

export const MOCK_ANNOUNCEMENTS = [
  { id: 'ann1', title: 'Mid-Semester Examinations Schedule Released', description: 'The timetable for mid-semester examinations has been published. All students are requested to check their department schedules. No rescheduling requests will be entertained after the schedule is confirmed.', priority: 'important', department_name: null, author_first_name: 'System', author_last_name: 'Admin', published_at: new Date(Date.now() - 2 * 86400000).toISOString(), expires_at: new Date(Date.now() + 30 * 86400000).toISOString(), is_active: true },
  { id: 'ann2', title: 'New Resources Added — CSE Semester 5', description: 'New study materials and previous year question papers have been uploaded for CSE Semester 5 subjects including Machine Learning and Software Engineering.', priority: 'normal', department_name: 'CSE', author_first_name: 'Deepak', author_last_name: 'Verma', published_at: new Date(Date.now() - 3 * 86400000).toISOString(), expires_at: null, is_active: true },
  { id: 'ann3', title: 'Library Timings Extended During Exam Season', description: 'The central library will remain open until 10:00 PM from Monday to Saturday during the examination period. Digital resources are available 24/7 through the EduVault portal.', priority: 'normal', department_name: null, author_first_name: 'System', author_last_name: 'Admin', published_at: new Date(Date.now() - 5 * 86400000).toISOString(), expires_at: null, is_active: true },
  { id: 'ann4', title: '⚠️ Portal Maintenance — Sunday 2:00 AM to 4:00 AM', description: 'The EduVault portal will undergo scheduled maintenance this Sunday between 2:00 AM and 4:00 AM. The portal will be unavailable during this window.', priority: 'urgent', department_name: null, author_first_name: 'System', author_last_name: 'Admin', published_at: new Date(Date.now() - 1 * 86400000).toISOString(), expires_at: new Date(Date.now() + 7 * 86400000).toISOString(), is_active: true },
  { id: 'ann5', title: 'Internship Opportunities — 2025 Batch', description: 'Several top companies have expressed interest in hiring interns. Students with CGPA above 7.5 are encouraged to register with the placement cell by end of this week.', priority: 'important', department_name: null, author_first_name: 'System', author_last_name: 'Admin', published_at: new Date(Date.now() - 4 * 86400000).toISOString(), expires_at: new Date(Date.now() + 14 * 86400000).toISOString(), is_active: true },
];

const future = (d) => { const dt = new Date(); dt.setDate(dt.getDate()+d); return dt.toISOString().split('T')[0]; };
const past   = (d) => { const dt = new Date(); dt.setDate(dt.getDate()-d); return dt.toISOString().split('T')[0]; };

export const MOCK_EVENTS = [
  { id: 'ev1', name: 'TechFest 2025 — Annual Technical Symposium', description: 'A two-day annual technical fest featuring hackathon, project exhibition, coding contests, and workshops on emerging technologies. Open to all students.', event_date: future(15), event_time: '09:00', venue: 'Main Auditorium & CSE Block', department_name: null, organizer: 'Student Technical Committee', registration_link: 'https://forms.google.com/techfest2025', is_active: true, created_at: new Date().toISOString() },
  { id: 'ev2', name: 'Workshop on Python for Data Science', description: 'A hands-on one-day workshop covering NumPy, Pandas, Matplotlib, and Scikit-learn. Prerequisites: Basic Python knowledge.', event_date: future(8), event_time: '10:00', venue: 'CSE Seminar Hall, Room 204', department_name: 'CSE', organizer: 'CSE Department', registration_link: 'https://forms.google.com/python-ws', is_active: true, created_at: new Date().toISOString() },
  { id: 'ev3', name: 'Guest Lecture: Future of VLSI Technology', description: 'An insightful guest lecture by Dr. Subramaniam from IIT Madras on VLSI chip design and career opportunities.', event_date: future(5), event_time: '14:00', venue: 'ECE Seminar Hall', department_name: 'ECE', organizer: 'ECE Department', registration_link: null, is_active: true, created_at: new Date().toISOString() },
  { id: 'ev4', name: 'Hackathon: Code for Tomorrow', description: '24-hour coding hackathon focused on social impact. Teams of 2-4. Winners get cash prizes and internship opportunities.', event_date: future(22), event_time: '08:00', venue: 'Computer Lab Complex', department_name: null, organizer: 'IEEE Student Branch', registration_link: 'https://forms.google.com/hackathon2025', is_active: true, created_at: new Date().toISOString() },
  { id: 'ev5', name: 'Placement Orientation — Final Year Students', description: 'Mandatory orientation session for all final year students regarding campus placement process, eligibility criteria, and interview tips.', event_date: future(3), event_time: '11:00', venue: 'Admin Block, Conference Hall', department_name: null, organizer: 'Training & Placement Cell', registration_link: null, is_active: true, created_at: new Date().toISOString() },
  { id: 'ev6', name: 'Freshers Welcome Ceremony 2025', description: 'Grand welcome ceremony for the new batch with cultural performances and introductions.', event_date: past(30), event_time: '10:00', venue: 'Main Auditorium', department_name: null, organizer: 'Student Welfare Committee', registration_link: null, is_active: true, created_at: new Date().toISOString() },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Resource Approved', message: 'Your resource "Data Structures Complete Notes" has been approved and is now visible to students.', type: 'approval', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n2', title: 'New Announcement', message: 'Mid-Semester Examinations Schedule Released. Check the announcements page for details.', type: 'announcement', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'n3', title: 'Upcoming Event', message: 'TechFest 2025 is coming up in 15 days. Register now!', type: 'event', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'n4', title: 'New Resource Available', message: 'Machine Learning Lecture Slides have been added to the resource library.', type: 'new_resource', is_read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
];

export const MOCK_ANALYTICS = {
  users: { total: 9, students: 5, faculty: 3, admins: 1 },
  resources: { total: 10, approved: 9, pending: 1, rejected: 0 },
  downloads: { total: 2059 },
  pendingApprovals: 1,
  activeUsers: 7,
  resourcesByDept: [
    { department: 'CSE', count: 6 },
    { department: 'ECE', count: 2 },
    { department: 'MECH', count: 1 },
    { department: 'MATH', count: 1 },
  ],
  resourcesByType: [
    { type: 'notes',           count: 3 },
    { type: 'question_papers', count: 1 },
    { type: 'lab_manuals',     count: 1 },
    { type: 'presentations',   count: 1 },
    { type: 'syllabus',        count: 1 },
    { type: 'ebooks',          count: 1 },
    { type: 'study_materials', count: 1 },
    { type: 'assignments',     count: 1 },
  ],
  mostDownloaded: MOCK_RESOURCES.filter(r=>r.status==='approved').sort((a,b)=>b.download_count-a.download_count).slice(0,10),
  recentUploads:  [...MOCK_RESOURCES].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,10).map(r=>({...r, uploader_first_name: r.uploader_first_name, uploader_last_name: r.uploader_last_name})),
  monthlyUploads:    [{ month:'Apr 2026', total:2 },{ month:'May 2026', total:3 },{ month:'Jun 2026', total:4 },{ month:'Jul 2026', total:2 },{ month:'Aug 2026', total:5 },{ month:'Sep 2026', total:3 }],
  monthlyDownloads:  [{ month:'Apr 2026', total:280},{ month:'May 2026', total:340},{ month:'Jun 2026', total:420},{ month:'Jul 2026', total:380},{ month:'Aug 2026', total:510},{ month:'Sep 2026', total:470}],
};

export const MOCK_SUBJECTS = [
  { id:'s1', name:'Data Structures & Algorithms',  code:'CSE301', department_id:'d1', department_code:'CSE', semester:3, credits:4, is_active:true },
  { id:'s2', name:'Database Management Systems',   code:'CSE302', department_id:'d1', department_code:'CSE', semester:3, credits:4, is_active:true },
  { id:'s3', name:'Operating Systems',             code:'CSE401', department_id:'d1', department_code:'CSE', semester:4, credits:4, is_active:true },
  { id:'s4', name:'Machine Learning',              code:'CSE501', department_id:'d1', department_code:'CSE', semester:5, credits:4, is_active:true },
  { id:'s5', name:'Computer Networks',             code:'CSE402', department_id:'d1', department_code:'CSE', semester:4, credits:3, is_active:true },
  { id:'s6', name:'Digital Signal Processing',     code:'ECE301', department_id:'d2', department_code:'ECE', semester:3, credits:4, is_active:true },
  { id:'s7', name:'Engineering Thermodynamics',    code:'ME301',  department_id:'d3', department_code:'MECH',semester:3, credits:4, is_active:true },
  { id:'s8', name:'Probability & Statistics',      code:'MA301',  department_id:'d7', department_code:'MATH',semester:3, credits:3, is_active:true },
  { id:'s9', name:'Software Engineering',          code:'CSE502', department_id:'d1', department_code:'CSE', semester:5, credits:3, is_active:true },
  { id:'s10',name:'VLSI Design',                   code:'ECE501', department_id:'d2', department_code:'ECE', semester:5, credits:4, is_active:true },
];

export const MOCK_USERS_LIST = Object.values(MOCK_USERS).concat([
  { id:'u4', email:'faculty.ece@eduvault.edu', role:'faculty', first_name:'Kavitha', last_name:'Murthy', department_name:'ECE', department_code:'ECE', is_active:true, created_at:new Date().toISOString() },
  { id:'u5', email:'student2@eduvault.edu',    role:'student', first_name:'Priya',   last_name:'Nair',   department_name:'CSE', department_code:'CSE', semester:5, is_active:true, created_at:new Date().toISOString() },
  { id:'u6', email:'student3@eduvault.edu',    role:'student', first_name:'Ravi',    last_name:'Teja',   department_name:'ECE', department_code:'ECE', semester:3, is_active:true, created_at:new Date().toISOString() },
]);
