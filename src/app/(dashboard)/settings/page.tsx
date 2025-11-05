
import AppHeader from '@/components/header';
import { promises as fs } from 'fs';
import path from 'path';
import type { User } from '@/lib/types';
import SettingsClient from '@/components/users/settings-client';

async function getUsers(): Promise<User[]> {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'users.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    return jsonData.users || [];
  } catch (error) {
    console.error('Error reading or parsing users.json:', error);
    return [];
  }
}

export default async function SettingsPage() {
  const users = await getUsers();

  return <SettingsClient initialUsers={users} />;
}
