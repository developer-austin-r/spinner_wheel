import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  try {
    // Seed User role
    const userRole = await prisma.role.upsert({
      where: { slug: 'user' },
      update: {},
      create: {
        roleName: 'User',
        slug: 'user',
      },
    });

    // Seed Super Admin role
    const superAdminRole = await prisma.role.upsert({
      where: { slug: 'super_admin' },
      update: {},
      create: {
        roleName: 'Super Admin',
        slug: 'super_admin',
      },
    });

    console.log('✓ Roles seeded:', { userRole, superAdminRole });
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
}
