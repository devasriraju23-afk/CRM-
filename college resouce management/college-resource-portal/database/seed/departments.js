export const seedDepartments = async (client) => {
  const departments = [
    { name: 'Computer Science & Engineering',     code: 'CSE',  description: 'Software, algorithms, and computing systems', hod_name: 'Dr. Ramesh Kumar' },
    { name: 'Electronics & Communication Engg',   code: 'ECE',  description: 'Electronics, signals, and communications',     hod_name: 'Dr. Priya Sharma' },
    { name: 'Mechanical Engineering',              code: 'MECH', description: 'Machines, thermodynamics, and manufacturing', hod_name: 'Dr. Arun Patel' },
    { name: 'Civil Engineering',                   code: 'CIVIL',description: 'Structures, transportation, and environment', hod_name: 'Dr. Lakshmi Iyer' },
    { name: 'Electrical Engineering',              code: 'EEE',  description: 'Power systems and electrical machines',       hod_name: 'Dr. Suresh Nair' },
    { name: 'Information Technology',              code: 'IT',   description: 'Information systems and web technologies',   hod_name: 'Dr. Anitha Reddy' },
    { name: 'Mathematics',                         code: 'MATH', description: 'Pure and applied mathematics',               hod_name: 'Dr. Vijay Gopal' },
    { name: 'Physics',                             code: 'PHY',  description: 'Classical and modern physics',               hod_name: 'Dr. Meena Krishnan' },
  ];

  for (const dept of departments) {
    await client.query(
      `INSERT INTO departments (name, code, description, hod_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (code) DO NOTHING`,
      [dept.name, dept.code, dept.description, dept.hod_name]
    );
  }
};
