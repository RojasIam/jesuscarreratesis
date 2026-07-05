'use client';

import { useState } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { ROLE_LABELS, type UserRole } from '@/lib/roles';
import {
  buildFullName,
  displayApellidos,
  displayNombres,
  type ProfileRow,
} from '@/lib/users';

const ROLES: UserRole[] = ['tecnico', 'admin', 'ti'];

const selectClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:text-white/90';

type FormularioUsuarioProps = {
  usuario?: ProfileRow;
  onSaved: () => void;
  onCancel?: () => void;
};

export default function FormularioUsuario({ usuario, onSaved, onCancel }: FormularioUsuarioProps) {
  const isEdit = Boolean(usuario);

  const [nombres, setNombres] = useState(() =>
    usuario ? displayNombres(usuario).replace('—', '') : '',
  );
  const [apellidos, setApellidos] = useState(() =>
    usuario ? displayApellidos(usuario).replace('—', '') : '',
  );
  const [phone, setPhone] = useState(usuario?.phone ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(usuario?.role ?? 'tecnico');
  const [showPassword, setShowPassword] = useState(false);
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetPasswordFields = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleTogglePasswordChange = () => {
    resetPasswordFields();
    setCambiarPassword(true);
  };

  const handleCancelPasswordChange = () => {
    resetPasswordFields();
    setCambiarPassword(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEdit) {
      if (!password) {
        setError('Ingrese una contraseña');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
    } else if (cambiarPassword && (password || confirmPassword)) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
    }

    const payload = {
      nombres,
      apellidos,
      phone,
      email,
      role,
      ...(password ? { password } : {}),
    };

    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/usuarios/${usuario!.id}` : '/api/usuarios', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? payload : { ...payload, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? (isEdit ? 'Error al actualizar usuario' : 'Error al crear usuario'));
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete={isEdit ? 'off' : 'on'}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="nombres">Nombres</Label>
          <Input
            id="nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            placeholder="Ej. Juan Carlos"
          />
        </div>
        <div>
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder="Ej. Pérez García"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Número de celular</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej. 987 654 321"
        />
      </div>

      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name={isEdit ? 'usuario-email' : 'email'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@empresa.com"
          autoComplete={isEdit ? 'off' : 'email'}
        />
      </div>

      <div>
        <Label htmlFor="role">Rol</Label>
        <select
          id="role"
          className={selectClass}
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      {isEdit && !cambiarPassword ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Contraseña</p>
          <p className="mt-1 text-theme-xs text-gray-500">
            No se modificará al guardar. Use esta opción solo si el usuario olvidó su acceso.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={handleTogglePasswordChange}
          >
            Cambiar contraseña
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isEdit ? 'Nueva contraseña' : 'Contraseña'}
              </p>
              {isEdit ? (
                <p className="mt-1 text-theme-xs text-gray-500">
                  Ingrese y confirme la nueva contraseña para actualizarla.
                </p>
              ) : null}
            </div>
            {isEdit ? (
              <Button type="button" variant="outline" size="sm" onClick={handleCancelPasswordChange}>
                No cambiar
              </Button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="usuario-nueva-clave">{isEdit ? 'Nueva contraseña' : 'Contraseña'}</Label>
              <div className="relative">
                <Input
                  id="usuario-nueva-clave"
                  name="usuario-nueva-clave"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEdit ? 'Mínimo 8 caracteres' : 'Mínimo 8 caracteres'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeCloseIcon className="size-5" /> : <EyeIcon className="size-5" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="usuario-confirmar-clave">Confirmar contraseña</Label>
              <Input
                id="usuario-confirmar-clave"
                name="usuario-confirmar-clave"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita la contraseña"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>
      )}

      {nombres.trim() || apellidos.trim() ? (
        <p className="text-theme-xs text-gray-500">
          Nombre completo:{' '}
          <span className="font-medium text-gray-700">{buildFullName(nombres, apellidos)}</span>
        </p>
      ) : null}

      {error ? <p className="text-sm text-error-600">{error}</p> : null}

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
}
