import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const defaultPassword = await bcrypt.hash('Admin@123', 10);

  const users = [
    {
      email: 'owner@sukrivineyard.com',
      password: defaultPassword,
      name: 'Vineyard Owner',
      role: 'owner',
      vineyardId: 'all',
    },
    {
      email: 'hr@sukrivineyard.com',
      password: defaultPassword,
      name: 'HR Manager',
      role: 'hr',
      vineyardId: 'sukhri',
    },
    {
      email: 'admin@sukrivineyard.com',
      password: defaultPassword,
      name: 'System Admin',
      role: 'admin',
      vineyardId: 'sukhri',
    },
    {
      email: 'gm@sukrivineyard.com',
      password: defaultPassword,
      name: 'General Manager',
      role: 'gm',
      vineyardId: 'sukhri',
    },
    {
      email: 'vendor@sukrivineyard.com',
      password: defaultPassword,
      name: 'Vendor Partner',
      role: 'vendor',
      vineyardId: null,
    },
    {
      email: 'cleaner@sukrivineyard.com',
      password: defaultPassword,
      name: 'John Cleaner',
      role: 'cleaner',
      vineyardId: 'sukhri',
    },
    {
      email: 'caretaker@sukrivineyard.com',
      password: defaultPassword,
      name: 'Sarah Caretaker',
      role: 'caretaker',
      vineyardId: 'sukhri',
    },
    {
      email: 'gasfiller@sukrivineyard.com',
      password: defaultPassword,
      name: 'Mike Gas Filler',
      role: 'gas-filler',
      vineyardId: 'sukhri',
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${userData.email}`);
    }
  }
}

