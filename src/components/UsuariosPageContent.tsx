'use client';

import { useState } from 'react';
import FormularioUsuario from '@/components/FormularioUsuario';
import UsuariosTabla from '@/components/UsuariosTabla';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/Modal';
import type { ProfileRow } from '@/lib/users';
import { buildFullName, displayApellidos, displayNombres } from '@/lib/users';

export default function UsuariosPageContent() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileRow | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formSession, setFormSession] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleSaved = () => {
    setRefreshKey((key) => key + 1);
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const openCreateForm = () => {
    setFormSession((session) => session + 1);
    setCreateModalOpen(true);
  };

  const openEditForm = (usuario: ProfileRow) => {
    setSelectedUser(usuario);
    setFormSession((session) => session + 1);
    setEditModalOpen(true);
  };

  const openDeleteConfirm = (usuario: ProfileRow) => {
    setSelectedUser(usuario);
    setDeleteError('');
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/usuarios/${selectedUser.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al eliminar');
      setDeleteModalOpen(false);
      setSelectedUser(null);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setDeleting(false);
    }
  };

  const deleteLabel = selectedUser
    ? buildFullName(
        displayNombres(selectedUser).replace('—', ''),
        displayApellidos(selectedUser).replace('—', ''),
      ) || selectedUser.email
    : '';

  return (
    <div className="min-w-0 w-full">
      <UsuariosTabla
        refreshKey={refreshKey}
        onNewUserClick={openCreateForm}
        onEditUser={openEditForm}
        onDeleteUser={openDeleteConfirm}
      />

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <div className="max-h-[min(90vh,900px)] overflow-y-auto px-5 pt-6 pb-6 sm:px-8">
          <div className="mb-6 pr-10">
            <h2 className="text-lg font-semibold text-gray-800">Nuevo usuario</h2>
            <p className="mt-1 text-sm text-gray-500">
              Registre un usuario con acceso al sistema y asigne su rol
            </p>
          </div>
          <FormularioUsuario
            key={`create-${formSession}`}
            onSaved={handleSaved}
            onCancel={() => setCreateModalOpen(false)}
          />
        </div>
      </Modal>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <div className="max-h-[min(90vh,900px)] overflow-y-auto px-5 pt-6 pb-6 sm:px-8">
          <div className="mb-6 pr-10">
            <h2 className="text-lg font-semibold text-gray-800">Editar usuario</h2>
            <p className="mt-1 text-sm text-gray-500">
              Actualice los datos o asigne una nueva contraseña
            </p>
          </div>
          {selectedUser ? (
            <FormularioUsuario
              key={`edit-${formSession}`}
              usuario={selectedUser}
              onSaved={handleSaved}
              onCancel={() => setEditModalOpen(false)}
            />
          ) : null}
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => !deleting && setDeleteModalOpen(false)}>
        <div className="px-5 pt-6 pb-6 sm:px-8">
          <div className="mb-6 pr-10">
            <h2 className="text-lg font-semibold text-gray-800">Eliminar usuario</h2>
            <p className="mt-2 text-sm text-gray-600">
              ¿Eliminar a <span className="font-semibold text-gray-800">{deleteLabel}</span>? Esta
              acción no se puede deshacer y también borrará sus mediciones asociadas.
            </p>
          </div>
          {deleteError ? <p className="mb-4 text-sm text-error-600">{deleteError}</p> : null}
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
