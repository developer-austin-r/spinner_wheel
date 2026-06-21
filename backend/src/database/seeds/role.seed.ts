import { DataSource } from 'typeorm';
import { Role } from '../entities';

export async function seedRoles(dataSource: DataSource) {
  const repository = dataSource.getRepository(Role);
  await repository.upsert(
    [
      { roleName: 'User', slug: 'user' },
      { roleName: 'Super Admin', slug: 'super_admin' },
    ],
    ['slug'],
  );
  console.log('Roles seeded.');
}
