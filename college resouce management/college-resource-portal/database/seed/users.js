import bcrypt from 'bcryptjs';

export const seedUsers = async (client) => {
  const hash = await bcrypt.hash('Password@123', 12);

  // Get department ids
  const depts = (await client.query('SELECT id, code FROM departments')).rows;
  const deptMap = Object.fromEntries(depts.map((d) => [d.code, d.id]));

  const users = [
    // Admin
    {
      email: 'admin@eduvault.edu',
      role: 'admin',
      first_name: 'System',
      last_name: 'Admin',
      department_id: deptMap['CSE'],
      employee_id: 'ADM001',
    },
    // Faculty
    {
      email: 'faculty.cs@eduvault.edu',
      role: 'faculty',
      first_name: 'Deepak',
      last_name: 'Verma',
      department_id: deptMap['CSE'],
      employee_id: 'FAC001',
    },
    {
      email: 'faculty.ece@eduvault.edu',
      role: 'faculty',
      first_name: 'Kavitha',
      last_name: 'Murthy',
      department_id: deptMap['ECE'],
      employee_id: 'FAC002',
    },
    {
      email: 'faculty.mech@eduvault.edu',
      role: 'faculty',
      first_name: 'Rajesh',
      last_name: 'Singh',
      department_id: deptMap['MECH'],
      employee_id: 'FAC003',
    },
    // Students
    {
      email: 'student1@eduvault.edu',
      role: 'student',
      first_name: 'Arjun',
      last_name: 'Mehta',
      department_id: deptMap['CSE'],
      semester: 5,
      roll_number: 'CS21001',
    },
    {
      email: 'student2@eduvault.edu',
      role: 'student',
      first_name: 'Priya',
      last_name: 'Nair',
      department_id: deptMap['CSE'],
      semester: 5,
      roll_number: 'CS21002',
    },
    {
      email: 'student3@eduvault.edu',
      role: 'student',
      first_name: 'Ravi',
      last_name: 'Teja',
      department_id: deptMap['ECE'],
      semester: 3,
      roll_number: 'EC22001',
    },
    {
      email: 'student4@eduvault.edu',
      role: 'student',
      first_name: 'Sneha',
      last_name: 'Pillai',
      department_id: deptMap['MECH'],
      semester: 6,
      roll_number: 'ME21001',
    },
    {
      email: 'student5@eduvault.edu',
      role: 'student',
      first_name: 'Kiran',
      last_name: 'Joshi',
      department_id: deptMap['IT'],
      semester: 4,
      roll_number: 'IT22001',
    },
  ];

  const ids = {};
  for (const u of users) {
    const result = await client.query(
      `INSERT INTO users
         (email, password_hash, role, first_name, last_name, department_id,
          semester, roll_number, employee_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id, role`,
      [
        u.email, hash, u.role, u.first_name, u.last_name,
        u.department_id || null,
        u.semester     || null,
        u.roll_number  || null,
        u.employee_id  || null,
      ]
    );
    const row = result.rows[0];
    ids[u.email] = row.id;
  }
  return ids;
};
