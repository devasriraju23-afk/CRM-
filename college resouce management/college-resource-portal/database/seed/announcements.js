export const seedAnnouncements = async (client, userIds) => {
  const admin      = userIds['admin@eduvault.edu'];
  const facultyCSE = userIds['faculty.cs@eduvault.edu'];

  const depts = (await client.query('SELECT id, code FROM departments')).rows;
  const deptMap = Object.fromEntries(depts.map((d) => [d.code, d.id]));

  const announcements = [
    {
      title: 'Mid-Semester Examinations Schedule Released',
      description: 'The timetable for mid-semester examinations has been published on the college website. All students are requested to check their respective department schedules and be prepared. No rescheduling requests will be entertained after the schedule is confirmed.',
      department_id: null,
      priority: 'important',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      created_by: admin,
    },
    {
      title: 'New Resources Added — CSE Semester 5',
      description: 'New study materials and previous year question papers have been uploaded for CSE Semester 5 subjects including Machine Learning and Software Engineering. Students can download them from the resource library.',
      department_id: deptMap['CSE'],
      priority: 'normal',
      expires_at: null,
      created_by: facultyCSE,
    },
    {
      title: 'Library Timings Extended During Exam Season',
      description: 'The central library will remain open until 10:00 PM from Monday to Saturday during the examination period. Digital resources are available 24/7 through the EduVault portal.',
      department_id: null,
      priority: 'normal',
      expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      created_by: admin,
    },
    {
      title: '⚠️ Portal Maintenance — Sunday 2:00 AM to 4:00 AM',
      description: 'The EduVault portal will undergo scheduled maintenance this Sunday between 2:00 AM and 4:00 AM. The portal will be unavailable during this window. Please plan your downloads accordingly.',
      department_id: null,
      priority: 'urgent',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_by: admin,
    },
    {
      title: 'Internship Opportunities — 2025 Batch',
      description: 'Several top companies have expressed interest in hiring interns from our college for the 2025 season. Students with a CGPA above 7.5 are encouraged to register with the placement cell and submit their updated resumes by the end of this week.',
      department_id: null,
      priority: 'important',
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      created_by: admin,
    },
  ];

  for (const a of announcements) {
    await client.query(
      `INSERT INTO announcements
         (title, description, department_id, priority, expires_at, created_by)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [a.title, a.description, a.department_id, a.priority, a.expires_at, a.created_by]
    );
  }
};
