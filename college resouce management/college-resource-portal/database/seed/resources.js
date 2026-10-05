export const seedResources = async (client, userIds) => {
  const depts    = (await client.query('SELECT id, code FROM departments')).rows;
  const subjects = (await client.query('SELECT id, code FROM subjects')).rows;
  const deptMap  = Object.fromEntries(depts.map((d) => [d.code, d.id]));
  const subMap   = Object.fromEntries(subjects.map((s) => [s.code, s.id]));

  const facultyCSE  = userIds['faculty.cs@eduvault.edu'];
  const facultyECE  = userIds['faculty.ece@eduvault.edu'];
  const facultyMECH = userIds['faculty.mech@eduvault.edu'];
  const admin       = userIds['admin@eduvault.edu'];

  const resources = [
    {
      title: 'Data Structures Complete Notes',
      description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, sorting and searching algorithms with examples and complexity analysis.',
      resource_type: 'notes',
      category: 'Core Subject',
      dept: 'CSE', subj: 'CSE301', semester: 3,
      file_url: '/api/files/sample-dsa-notes.pdf',
      file_key: 'sample-dsa-notes.pdf',
      file_type: 'pdf', file_size: 2456789,
      uploaded_by: facultyCSE, status: 'approved',
      download_count: 245, view_count: 890,
      tags: ['DSA', 'algorithms', 'data structures'],
    },
    {
      title: 'DBMS Previous Year Question Papers (2019–2023)',
      description: 'Collection of previous year exam papers for Database Management Systems from 2019 to 2023 with answer keys.',
      resource_type: 'question_papers',
      category: 'Exam Preparation',
      dept: 'CSE', subj: 'CSE302', semester: 3,
      file_url: '/api/files/dbms-pyq.pdf',
      file_key: 'dbms-pyq.pdf',
      file_type: 'pdf', file_size: 1234567,
      uploaded_by: facultyCSE, status: 'approved',
      download_count: 312, view_count: 1120,
      tags: ['DBMS', 'SQL', 'exam', 'question papers'],
    },
    {
      title: 'Operating Systems Lab Manual',
      description: 'Complete lab manual for OS practicals including process scheduling, memory management, and file system exercises.',
      resource_type: 'lab_manuals',
      category: 'Practical',
      dept: 'CSE', subj: 'CSE401', semester: 4,
      file_url: '/api/files/os-lab-manual.pdf',
      file_key: 'os-lab-manual.pdf',
      file_type: 'pdf', file_size: 3456789,
      uploaded_by: facultyCSE, status: 'approved',
      download_count: 178, view_count: 650,
      tags: ['OS', 'lab', 'Linux', 'shell scripting'],
    },
    {
      title: 'Machine Learning Lecture Slides — Unit 1 to 5',
      description: 'PowerPoint presentations covering supervised learning, unsupervised learning, neural networks, SVM, and model evaluation.',
      resource_type: 'presentations',
      category: 'Lecture Material',
      dept: 'CSE', subj: 'CSE501', semester: 5,
      file_url: '/api/files/ml-slides.pptx',
      file_key: 'ml-slides.pptx',
      file_type: 'pptx', file_size: 8765432,
      uploaded_by: facultyCSE, status: 'approved',
      download_count: 420, view_count: 1540,
      tags: ['ML', 'neural networks', 'deep learning', 'AI'],
    },
    {
      title: 'Computer Networks Syllabus',
      description: 'Official syllabus for Computer Networks as per the university curriculum including unit-wise topics and reference books.',
      resource_type: 'syllabus',
      category: 'Official',
      dept: 'CSE', subj: 'CSE402', semester: 4,
      file_url: '/api/files/cn-syllabus.pdf',
      file_key: 'cn-syllabus.pdf',
      file_type: 'pdf', file_size: 345678,
      uploaded_by: admin, status: 'approved',
      download_count: 189, view_count: 720,
      tags: ['networks', 'TCP/IP', 'syllabus'],
    },
    {
      title: 'Digital Signal Processing Notes — Complete',
      description: 'Full semester notes for DSP covering DFT, FFT, digital filters, Z-transform and applications.',
      resource_type: 'notes',
      category: 'Core Subject',
      dept: 'ECE', subj: 'ECE301', semester: 3,
      file_url: '/api/files/dsp-notes.pdf',
      file_key: 'dsp-notes.pdf',
      file_type: 'pdf', file_size: 4567890,
      uploaded_by: facultyECE, status: 'approved',
      download_count: 156, view_count: 580,
      tags: ['DSP', 'signals', 'FFT', 'filters'],
    },
    {
      title: 'VLSI Design Assignment — Unit 3',
      description: 'Assignment problems on CMOS logic design, timing analysis, and layout verification.',
      resource_type: 'assignments',
      category: 'Assignment',
      dept: 'ECE', subj: 'ECE501', semester: 5,
      file_url: '/api/files/vlsi-assignment.pdf',
      file_key: 'vlsi-assignment.pdf',
      file_type: 'pdf', file_size: 678901,
      uploaded_by: facultyECE, status: 'approved',
      download_count: 89, view_count: 320,
      tags: ['VLSI', 'CMOS', 'assignment'],
    },
    {
      title: 'Engineering Thermodynamics E-Book',
      description: 'Comprehensive e-book on thermodynamics covering laws of thermodynamics, cycles, refrigeration and air conditioning.',
      resource_type: 'ebooks',
      category: 'Reference',
      dept: 'MECH', subj: 'ME301', semester: 3,
      file_url: '/api/files/thermodynamics-ebook.pdf',
      file_key: 'thermodynamics-ebook.pdf',
      file_type: 'pdf', file_size: 12345678,
      uploaded_by: facultyMECH, status: 'approved',
      download_count: 203, view_count: 760,
      tags: ['thermodynamics', 'ebook', 'mechanical'],
    },
    {
      title: 'Software Engineering — Pending Review',
      description: 'Notes on SDLC, agile methodologies, UML diagrams, and testing strategies.',
      resource_type: 'notes',
      category: 'Core Subject',
      dept: 'CSE', subj: 'CSE502', semester: 5,
      file_url: '/api/files/se-notes.pdf',
      file_key: 'se-notes.pdf',
      file_type: 'pdf', file_size: 2134567,
      uploaded_by: facultyCSE, status: 'pending',
      download_count: 0, view_count: 0,
      tags: ['SE', 'agile', 'UML'],
    },
    {
      title: 'Probability & Statistics Study Material',
      description: 'Study material covering probability distributions, statistical inference, hypothesis testing, and regression analysis.',
      resource_type: 'study_materials',
      category: 'Study Aid',
      dept: 'MATH', subj: 'MA301', semester: 3,
      file_url: '/api/files/prob-stats.pdf',
      file_key: 'prob-stats.pdf',
      file_type: 'pdf', file_size: 3456123,
      uploaded_by: admin, status: 'approved',
      download_count: 267, view_count: 940,
      tags: ['statistics', 'probability', 'math'],
    },
  ];

  for (const r of resources) {
    const result = await client.query(
      `INSERT INTO resources
         (title, description, resource_type, category, department_id, subject_id,
          semester, file_url, file_key, file_type, file_size, uploaded_by,
          status, download_count, view_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING id`,
      [
        r.title, r.description, r.resource_type, r.category,
        deptMap[r.dept], subMap[r.subj] || null,
        r.semester, r.file_url, r.file_key, r.file_type, r.file_size,
        r.uploaded_by, r.status, r.download_count, r.view_count,
      ]
    );
    const resourceId = result.rows[0].id;

    // Insert tags
    for (const tag of (r.tags || [])) {
      await client.query(
        `INSERT INTO resource_tags (resource_id, tag) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [resourceId, tag]
      );
    }
  }
};
