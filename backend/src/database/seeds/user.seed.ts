import 'dotenv/config';
import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import dataSource from '../../config/data-source';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../profiles/entities/profile.entity';

async function seed() {
  const ds: DataSource = dataSource;
  if (!ds.isInitialized) {
    await ds.initialize();
  }

  const userRepo = ds.getRepository(User);
  const profileRepo = ds.getRepository(Profile);

  const existing = await userRepo.findOneBy({ email: 'dummy@example.com' });
  if (existing) {
    console.log('Dummy user already exists, skipping seed.');
    await ds.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = userRepo.create({
    email: 'dummy@example.com',
    username: 'dummyuser',
    password: hashedPassword,
    avatar_url: null,
    google_id: null,
  });

  const savedUser = await userRepo.save(user);

  const profile = profileRepo.create({
    user_id: savedUser.id,
    skin: '009',
    visited_realm_ids: '',
  });

  await profileRepo.save(profile);

  console.log(`Seeded dummy user: ${savedUser.email} (id: ${savedUser.id})`);
  await ds.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
