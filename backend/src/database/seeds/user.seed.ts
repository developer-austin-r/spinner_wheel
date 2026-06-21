import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, User } from '../entities';

export async function seedUsers(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);
  const userRole = await roleRepository.findOneByOrFail({ slug: 'user' });
  const superAdminRole = await roleRepository.findOneByOrFail({ slug: 'super_admin' });
  const password = await bcrypt.hash(process.env.SEED_USER_PASSWORD || 'Password@123', 10);
  const users = Array.from({ length: 6 }, (_, index) => ({
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    password,
    phoneNumber: `555-000${index + 1}`,
    roleId: userRole.id,
  }));

  const superAdmin = {
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      password,
      phoneNumber: '555-0007',
      roleId: superAdminRole.id,
  };
  const candidates = [...users, superAdmin];
  const existing = await userRepository.find({
    where: candidates.map(({ email }) => ({ email })),
    withDeleted: true,
  });
  const existingEmails = new Set(existing.map(({ email }) => email));
  const missingUsers = candidates.filter(({ email }) => !existingEmails.has(email));
  if (missingUsers.length > 0) {
    await userRepository.insert(missingUsers);
  }
  console.log('Users seeded.');
}
