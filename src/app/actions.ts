
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import type { User } from '@/lib/types';

// Define el esquema para un nuevo usuario
const userSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  role: z.enum(['admin', 'user']),
  permissions: z.array(z.string()).refine(value => value.some(item => item), {
    message: "Debes seleccionar al menos un permiso.",
  }),
});

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

async function readUsers(): Promise<{ users: User[] }> {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    // Si el archivo no existe o está vacío, devuelve una estructura válida
    return { users: [] };
  }
}

async function writeUsers(data: { users: User[] }): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function saveUser(newUser: Omit<User, 'id'>): Promise<{ success: boolean, error?: string, data?: User }> {
  const result = userSchema.safeParse(newUser);

  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError || "Datos de usuario inválidos." };
  }
  
  try {
    const data = await readUsers();
    
    const userExists = data.users.some(user => user.username === result.data.username);
    if (userExists) {
        return { success: false, error: 'El nombre de usuario ya existe.' };
    }

    const userWithId = {
        ...result.data,
        id: (Date.now() + Math.random()).toString(36), // Ensure unique ID
    };

    data.users.push(userWithId);
    await writeUsers(data);
    return { success: true, data: userWithId };
  } catch (error: any) {
    console.error('Failed to save user:', error);
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
}


export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string; data?: { userId: string } }> {
    try {
        const data = await readUsers();
        
        const initialUserCount = data.users.length;
        data.users = data.users.filter(user => user.id !== userId);

        if (data.users.length === initialUserCount) {
            return { success: false, error: 'No se encontró el usuario a eliminar.' };
        }

        await writeUsers(data);
        return { success: true, data: { userId } };
    } catch (error: any) {
        console.error('Failed to delete user:', error);
        return { success: false, error: error.message || 'An unknown error occurred' };
    }
}
