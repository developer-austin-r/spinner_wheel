import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  try {
    // Get the admin role
    const userRole = await prisma.role.findUnique({
      where: { slug: 'user' },
    });

    if (!userRole) {
      throw new Error('User role not found. Please seed roles first.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Password@123', 10);

    // Create 6 users
    const users = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const index = i + 1;
        return prisma.user.upsert({
          where: { email: `user${index}@example.com` },
          update: {},
          create: {
            name: `User ${index}`,
            email: `user${index}@example.com`,
            password: hashedPassword,
            phoneNumber: `555-000${index}`,
            roleId: userRole.id,
          },
        });
      })
    );

    console.log(`✓ Created ${users.length} users with password 'Password@123'`);
    users.forEach((user) => {
      console.log(`  - ${user.email} (${user.name})`);
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
