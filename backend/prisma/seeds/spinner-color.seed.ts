import { PrismaClient } from '@prisma/client';

export async function seedSpinnerColors(prisma: PrismaClient) {
  const colors = [
    { name: 'Red', slug: 'red' },
    { name: 'Orange', slug: 'orange' },
    { name: 'Yellow', slug: 'yellow' },
    { name: 'Green', slug: 'green' },
    { name: 'Light Blue', slug: 'light-blue' },
    { name: 'Blue', slug: 'blue' },
    { name: 'Indigo', slug: 'indigo' },
    { name: 'Pink', slug: 'pink' },
    { name: 'Purple', slug: 'purple' },
  ];

  for (const color of colors) {
    await prisma.spinnerColor.upsert({
      where: { colorSlug: color.slug },
      update: {},
      create: {
        colorName: color.name,
        colorSlug: color.slug,
      },
    });
  }

  console.log('Spinner colors seeded.');
}
