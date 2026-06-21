import { DataSource } from 'typeorm';
import { SpinnerColor } from '../entities';

export async function seedSpinnerColors(dataSource: DataSource) {
  const repository = dataSource.getRepository(SpinnerColor);
  await repository.upsert(
    [
      ['Red', 'red'], ['Orange', 'orange'], ['Yellow', 'yellow'],
      ['Green', 'green'], ['Light Blue', 'light-blue'], ['Blue', 'blue'],
      ['Indigo', 'indigo'], ['Pink', 'pink'], ['Purple', 'purple'],
    ].map(([colorName, colorSlug]) => ({ colorName, colorSlug })),
    ['colorSlug'],
  );
  console.log('Spinner colors seeded.');
}
