import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      roleName: 'Admin',
      slug: 'admin',
    },
  });

  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'super_admin' },
    update: {},
    create: {
      roleName: 'Super Admin',
      slug: 'super_admin',
    },
  });

  console.log('Seeded roles:', { adminRole, superAdminRole });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
