export const seedEvents = async (client, userIds) => {
  const admin = userIds['admin@eduvault.edu'];

  const depts = (await client.query('SELECT id, code FROM departments')).rows;
  const deptMap = Object.fromEntries(depts.map((d) => [d.code, d.id]));

  // Dates relative to "today"
  const future = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };
  const past = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  const events = [
    {
      name: 'TechFest 2025 — Annual Technical Symposium',
      description: 'A two-day annual technical fest featuring paper presentations, hackathon, project exhibition, coding contests, and workshops on emerging technologies. Open to all students.',
      event_date: future(15),
      event_time: '09:00',
      venue: 'Main Auditorium & CSE Block',
      department_id: null,
      organizer: 'Student Technical Committee',
      registration_link: 'https://forms.google.com/techfest2025',
      created_by: admin,
    },
    {
      name: 'Workshop on Python for Data Science',
      description: 'A hands-on one-day workshop covering Python libraries like NumPy, Pandas, Matplotlib, and Scikit-learn for data science applications. Prerequisites: Basic Python knowledge.',
      event_date: future(8),
      event_time: '10:00',
      venue: 'CSE Seminar Hall, Room 204',
      department_id: deptMap['CSE'],
      organizer: 'CSE Department',
      registration_link: 'https://forms.google.com/python-ws',
      created_by: admin,
    },
    {
      name: 'Guest Lecture: Future of VLSI Technology',
      description: 'An insightful guest lecture by Dr. Subramaniam from IIT Madras on the current state and future directions of VLSI chip design, semiconductor industry trends, and career opportunities.',
      event_date: future(5),
      event_time: '14:00',
      venue: 'ECE Seminar Hall',
      department_id: deptMap['ECE'],
      organizer: 'ECE Department',
      registration_link: null,
      created_by: admin,
    },
    {
      name: 'Hackathon: Code for Tomorrow',
      description: '24-hour coding hackathon with problem statements focused on social impact and smart city solutions. Teams of 2-4 students. Winners get cash prizes and internship opportunities.',
      event_date: future(22),
      event_time: '08:00',
      venue: 'Computer Lab Complex',
      department_id: null,
      organizer: 'IEEE Student Branch',
      registration_link: 'https://forms.google.com/hackathon2025',
      created_by: admin,
    },
    {
      name: 'Placement Orientation — Final Year Students',
      description: 'Mandatory orientation session for all final year students regarding the campus placement process, eligibility criteria, resume preparation, and interview tips.',
      event_date: future(3),
      event_time: '11:00',
      venue: 'Admin Block, Conference Hall',
      department_id: null,
      organizer: 'Training & Placement Cell',
      registration_link: null,
      created_by: admin,
    },
    // Past events
    {
      name: 'Freshers Welcome Ceremony 2025',
      description: 'Grand welcome ceremony for the new batch of students with cultural performances, introduction to college facilities, and interactions with senior students and faculty.',
      event_date: past(30),
      event_time: '10:00',
      venue: 'Main Auditorium',
      department_id: null,
      organizer: 'Student Welfare Committee',
      registration_link: null,
      created_by: admin,
    },
    {
      name: 'National Science Day Celebration',
      description: 'Celebration of National Science Day with quiz competitions, science experiments, and a special lecture on modern scientific discoveries.',
      event_date: past(10),
      event_time: '09:30',
      venue: 'Physics Department',
      department_id: deptMap['PHY'],
      organizer: 'Physics Department',
      registration_link: null,
      created_by: admin,
    },
  ];

  for (const e of events) {
    await client.query(
      `INSERT INTO events
         (name, description, event_date, event_time, venue, department_id,
          organizer, registration_link, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        e.name, e.description, e.event_date, e.event_time,
        e.venue, e.department_id, e.organizer, e.registration_link,
        e.created_by,
      ]
    );
  }
};
