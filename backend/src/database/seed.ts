import { AppDataSource } from './data-source';
import { seedRoles } from './seeds/role.seed';
import { seedUsers } from './seeds/user.seed';
import { seedSpinnerColors } from './seeds/spinner-color.seed';

async function seed() {
  await AppDataSource.initialize();
  try {
    await seedRoles(AppDataSource);
    await seedUsers(AppDataSource);
    await seedSpinnerColors(AppDataSource);
    console.log('All seeds completed.');
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Database seeding failed:', error);
  process.exit(1);
});
