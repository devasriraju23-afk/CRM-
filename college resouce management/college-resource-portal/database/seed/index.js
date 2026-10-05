/**
 * Seed orchestrator — runs all seed functions in order.
 */
import { seedDepartments } from './departments.js';
import { seedUsers }       from './users.js';
import { seedSubjects }    from './subjects.js';
import { seedResources }   from './resources.js';
import { seedAnnouncements } from './announcements.js';
import { seedEvents }      from './events.js';

export const seedAll = async (client) => {
  console.log('🌱 Seeding departments…');
  await seedDepartments(client);

  console.log('🌱 Seeding users…');
  const userIds = await seedUsers(client);

  console.log('🌱 Seeding subjects…');
  await seedSubjects(client);

  console.log('🌱 Seeding resources…');
  await seedResources(client, userIds);

  console.log('🌱 Seeding announcements…');
  await seedAnnouncements(client, userIds);

  console.log('🌱 Seeding events…');
  await seedEvents(client, userIds);

  console.log('✅ All seed data inserted.');
};
