
'use client';

import AppHeader from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ShieldQuestion } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddUserForm } from '@/components/users/add-user-form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import usersData from '@/lib/users.json';

// This is a simplified, client-side only user management for demonstration.
// In a real app, this would be handled by a secure backend and database.

type User = typeof usersData.users[0];

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>(usersData.users);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { toast } = useToast();

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    // In a real app, you would send this to a server.
    // Here we're just updating local state to simulate it.
    const userWithId = { ...newUser, id: (Math.random() * 10000).toString(36) };
    setUsers(currentUsers => [...currentUsers, userWithId]);
    toast({
      title: "Usuario Creado (Simulado)",
      description: `El usuario "${userWithId.username}" ha sido añadido.`,
    });
    setIsAddUserOpen(false);
    // NOTE: This does not persist the user. Refreshing the page will reset users
    // to the initial state from users.json.
  };

  const openDeleteDialog = (user: User) => {
    if (user.role === 'admin') {
      toast({
        variant: "destructive",
        title: "Acción no permitida",
        description: "No se puede eliminar al usuario administrador.",
      });
      return;
    }
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(currentUsers => currentUsers.filter(u => u.id !== userToDelete.id));
      toast({
        title: "Usuario Eliminado (Simulado)",
        description: `El usuario "${userToDelete.username}" ha sido eliminado.`,
      });
    }
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  }

  const permissionLabels: { [key: string]: string } = {
    dashboard: 'Panel',
    inventory: 'Inventario',
    loans: 'Préstamos',
    settings: 'Configuración'
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <AppHeader title="Configuración">
            <Button size="sm" onClick={() => setIsAddUserOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir Usuario
            </Button>
        </AppHeader>
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Añade o elimina usuarios y gestiona sus permisos de acceso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Permisos</TableHead>
                            <TableHead><span className="sr-only">Acciones</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="flex flex-wrap gap-1">
                                  {user.role === 'admin' ? (
                                    <Badge>Todos</Badge>
                                  ) : user.permissions && user.permissions.length > 0 ? (
                                    user.permissions.map(p => <Badge key={p} variant="outline">{permissionLabels[p] || p}</Badge>)
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Ninguno</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => openDeleteDialog(user)}
                                    disabled={user.role === 'admin'}
                                    aria-label="Eliminar usuario"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldQuestion className="h-5 w-5" />
                        Sobre este Sistema de Permisos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Este es un sistema de gestión de usuarios **simulado** y funciona únicamente en el cliente.
                        Cualquier usuario que crees o elimines **desaparecerá al recargar la página**.
                        En una aplicación real, esta lógica estaría conectada a una base de datos segura y un backend.
                    </p>
                </CardContent>
            </Card>

          </div>
        </main>
      </div>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
                <DialogDescription>
                    Completa los detalles para crear una nueva cuenta de usuario.
                </DialogDescription>
            </DialogHeader>
            <AddUserForm onSubmit={handleAddUser} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al usuario "{userToDelete?.name}". Esta acción es simulada y se revertirá al recargar la página.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
