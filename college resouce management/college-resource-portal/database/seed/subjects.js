export const seedSubjects = async (client) => {
  const depts = (await client.query('SELECT id, code FROM departments')).rows;
  const deptMap = Object.fromEntries(depts.map((d) => [d.code, d.id]));

  const subjects = [
    // CSE
    { name: 'Data Structures & Algorithms',    code: 'CSE301', dept: 'CSE', semester: 3, credits: 4 },
    { name: 'Database Management Systems',     code: 'CSE302', dept: 'CSE', semester: 3, credits: 4 },
    { name: 'Operating Systems',               code: 'CSE401', dept: 'CSE', semester: 4, credits: 4 },
    { name: 'Computer Networks',               code: 'CSE402', dept: 'CSE', semester: 4, credits: 3 },
    { name: 'Machine Learning',                code: 'CSE501', dept: 'CSE', semester: 5, credits: 4 },
    { name: 'Software Engineering',            code: 'CSE502', dept: 'CSE', semester: 5, credits: 3 },
    { name: 'Web Technologies',                code: 'CSE601', dept: 'CSE', semester: 6, credits: 3 },
    { name: 'Artificial Intelligence',         code: 'CSE602', dept: 'CSE', semester: 6, credits: 4 },
    // ECE
    { name: 'Digital Signal Processing',       code: 'ECE301', dept: 'ECE', semester: 3, credits: 4 },
    { name: 'Analog Circuits',                 code: 'ECE302', dept: 'ECE', semester: 3, credits: 3 },
    { name: 'Microprocessors',                 code: 'ECE401', dept: 'ECE', semester: 4, credits: 4 },
    { name: 'Communication Systems',           code: 'ECE402', dept: 'ECE', semester: 4, credits: 4 },
    { name: 'VLSI Design',                     code: 'ECE501', dept: 'ECE', semester: 5, credits: 4 },
    // MECH
    { name: 'Engineering Thermodynamics',      code: 'ME301',  dept: 'MECH', semester: 3, credits: 4 },
    { name: 'Fluid Mechanics',                 code: 'ME302',  dept: 'MECH', semester: 3, credits: 3 },
    { name: 'Machine Design',                  code: 'ME401',  dept: 'MECH', semester: 4, credits: 4 },
    { name: 'Manufacturing Processes',         code: 'ME402',  dept: 'MECH', semester: 4, credits: 3 },
    // CIVIL
    { name: 'Structural Analysis',             code: 'CE301',  dept: 'CIVIL', semester: 3, credits: 4 },
    { name: 'Soil Mechanics',                  code: 'CE302',  dept: 'CIVIL', semester: 3, credits: 3 },
    // MATH (shared)
    { name: 'Engineering Mathematics I',       code: 'MA101',  dept: 'MATH', semester: 1, credits: 4 },
    { name: 'Engineering Mathematics II',      code: 'MA102',  dept: 'MATH', semester: 2, credits: 4 },
    { name: 'Probability & Statistics',        code: 'MA301',  dept: 'MATH', semester: 3, credits: 3 },
  ];

  for (const s of subjects) {
    if (!deptMap[s.dept]) continue;
    await client.query(
      `INSERT INTO subjects (name, code, department_id, semester, credits)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (code) DO NOTHING`,
      [s.name, s.code, deptMap[s.dept], s.semester, s.credits]
    );
  }
};
