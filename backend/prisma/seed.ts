import { PrismaClient } from '@prisma/client';
import { seedRoles } from './seeds/role.seed';
import { seedUsers } from './seeds/user.seed';
import { seedSpinnerColors } from './seeds/spinner-color.seed';

const prisma = new PrismaClient();

async function main() {
    await seedRoles(prisma);
    await seedUsers(prisma);
    await seedSpinnerColors(prisma);
    console.log('All seeds completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });