'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import UserAvatar from '@/components/common/UserAvatar';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/roles';
import { parseApiResponse } from '@/lib/api-response';

const AVATAR_FOLDER = 'optical-quality/avatars';
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

function resolveUserPhotoUrl(
  profile: { avatar_url?: string | null } | null,
  user: { user_metadata?: Record<string, unknown> } | null,
): string | null {
  const fromProfile = profile?.avatar_url?.trim();
  if (fromProfile) return fromProfile;

  const meta = user?.user_metadata;
  const fromMeta =
    (typeof meta?.avatar_url === 'string' && meta.avatar_url) ||
    (typeof meta?.picture === 'string' && meta.picture);

  return fromMeta || null;
}

function ProfileField({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-theme-xs text-gray-500">{label}</p>
      {children ?? (
        <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
      )}
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.59724 10.0939C4.33102 10.3602 4.18645 10.718 4.18645 11.0901V13.9101C4.18645 14.2822 4.33102 14.64 4.59724 14.9062L6.41724 16.7262C6.68346 16.9924 7.04124 17.137 7.41335 17.137H10.2334C10.6055 17.137 10.9632 16.9924 11.2295 16.7262L15.0911 12.8646C15.9698 11.9859 15.9698 10.5612 15.0911 9.68249L15.0911 2.78206ZM12.9692 3.84197C13.2621 3.54908 13.7369 3.54908 14.0298 3.84197C14.3227 4.13486 14.3227 4.60974 14.0298 4.90263L8.86724 10.0652L6.13245 7.33041L12.9692 3.84197ZM5.59245 8.87041L8.32724 11.6052L5.41335 14.5191H7.41335L11.275 10.6575L5.59245 8.87041Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function PerfilContent() {
  const { user, profile, role, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const savedPhotoUrl = resolveUserPhotoUrl(profile, user);
  const displayPhotoUrl = photoPreview ?? savedPhotoUrl;
  const displayName = profile?.full_name ?? user?.email ?? 'Usuario';

  useEffect(() => {
    if (!isEditing) {
      setFullName(profile?.full_name ?? '');
    }
  }, [profile?.full_name, isEditing]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const resetDraft = () => {
    setFullName(profile?.full_name ?? '');
    setPassword('');
    setPasswordConfirm('');
    setShowPassword(false);
    setShowPasswordConfirm(false);
    setPendingPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartEdit = () => {
    setError(null);
    setSuccess(null);
    resetDraft();
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetDraft();
    setError(null);
    setIsEditing(false);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setSuccess(null);

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('La foto debe ser JPG, PNG o WebP');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError('La foto no puede superar 5 MB');
      event.target.value = '';
      return;
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview);

    setPendingPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError('El nombre es obligatorio');
      return;
    }

    const trimmedPassword = password.trim();
    const trimmedPasswordConfirm = passwordConfirm.trim();

    if (trimmedPassword || trimmedPasswordConfirm) {
      if (trimmedPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (trimmedPassword !== trimmedPasswordConfirm) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }

    setSaving(true);

    try {
      let avatarUrl: string | null | undefined;
      let avatarPublicId: string | null | undefined;

      if (pendingPhoto) {
        const uploadData = new FormData();
        uploadData.append('file', pendingPhoto);
        uploadData.append('folder', AVATAR_FOLDER);

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const uploadJson = await parseApiResponse<{ error?: string; url?: string; publicId?: string }>(
          uploadRes,
          'Error al subir la foto',
        );

        if (!uploadRes.ok) {
          throw new Error(uploadJson.error ?? 'Error al subir la foto');
        }

        avatarUrl = uploadJson.url!;
        avatarPublicId = uploadJson.publicId!;
      }

      const payload: Record<string, string | null> = { full_name: trimmedName };
      if (avatarUrl !== undefined) payload.avatar_url = avatarUrl;
      if (avatarPublicId !== undefined) payload.avatar_public_id = avatarPublicId;
      if (trimmedPassword) {
        payload.password = trimmedPassword;
        payload.password_confirm = trimmedPasswordConfirm;
      }

      const profileRes = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const profileJson = await parseApiResponse<{ error?: string }>(
        profileRes,
        'Error al guardar el perfil',
      );

      if (!profileRes.ok) {
        throw new Error(profileJson.error ?? 'Error al guardar el perfil');
      }

      await refreshProfile();
      resetDraft();
      setIsEditing(false);
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-theme-xs"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 lg:px-6">
        <h3 className="text-lg font-semibold text-gray-800">Mi perfil</h3>
        {!isEditing ? (
          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50"
          >
            <EditIcon />
            Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-brand-50 via-white to-brand-50/40 px-5 py-8 lg:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative">
            <div className="rounded-full ring-4 ring-white ring-offset-2 ring-offset-brand-50">
              <UserAvatar photoUrl={displayPhotoUrl} alt={displayName} size="lg" />
            </div>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-theme-sm transition hover:bg-gray-50 hover:text-brand-500"
                  aria-label="Cambiar foto"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M11.3333 2.00004C11.5084 1.82493 11.7163 1.686 11.9451 1.59129C12.1739 1.49659 12.4191 1.44775 12.6667 1.44775C12.9142 1.44775 13.1594 1.49659 13.3882 1.59129C13.617 1.686 13.8249 1.82493 14 2.00004C14.1751 2.17515 14.314 2.38305 14.4087 2.61185C14.5034 2.84065 14.5523 3.08587 14.5523 3.33337C14.5523 3.58088 14.5034 3.8261 14.4087 4.0549C14.314 4.2837 14.1751 4.4916 14 4.66671L5.33333 13.3334L2 14L2.66667 10.6667L11.3333 2.00004Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-xl font-semibold text-gray-800">
              {isEditing ? fullName.trim() || displayName : displayName}
            </h4>
            <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
            {role && (
              <div className="mt-3">
                <Badge color="primary" size="sm">
                  {ROLE_LABELS[role]}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-6 lg:px-6">
        {(error || success) && (
          <div className="mb-5 space-y-3">
            {error && (
              <p className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-600">
                {success}
              </p>
            )}
          </div>
        )}

        {isEditing && (
          <div className="max-w-md space-y-5">
            <div>
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                disabled={saving}
              />
            </div>
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" value={user?.email ?? ''} disabled />
            </div>

            <div>
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dejar vacío para no cambiar"
                  disabled={saving}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                      <path
                        d="M2.5 10C2.5 10 5.83333 4.16667 10 4.16667C14.1667 4.16667 17.5 10 17.5 10C17.5 10 14.1667 15.8333 10 15.8333C5.83333 15.8333 2.5 10 2.5 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                      <path
                        d="M2.01667 2.5L17.5 17.9833M8.58333 8.58333C8.08333 9.08333 7.83333 9.66667 7.83333 10.3333C7.83333 11.9667 9.2 13.3333 10.8333 13.3333C11.5 13.3333 12.0833 13.0833 12.5833 12.5833M4.93333 4.93333C3.66667 5.93333 2.66667 7.33333 2.01667 9.16667C2.01667 9.16667 4.16667 14.1667 10 14.1667C11.25 14.1667 12.3333 13.8333 13.25 13.3333L4.93333 4.93333ZM10 4.16667C15.8333 4.16667 17.9833 9.16667 17.9833 9.16667C17.5167 10.3167 16.7833 11.3167 15.85 12.1167L13.5833 9.85C14.0833 9.35 14.3333 8.76667 14.3333 8.1C14.3333 6.46667 12.9667 5.1 11.3333 5.1C10.6667 5.1 10.0833 5.35 9.58333 5.85L7.85 4.11667C8.76667 4.61667 9.85 4.91667 10 4.16667Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {password.trim() !== '' && (
              <div>
                <Label htmlFor="password_confirm">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    disabled={saving}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm((v) => !v)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPasswordConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPasswordConfirm ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path
                          d="M2.5 10C2.5 10 5.83333 4.16667 10 4.16667C14.1667 4.16667 17.5 10 17.5 10C17.5 10 14.1667 15.8333 10 15.8333C5.83333 15.8333 2.5 10 2.5 10Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path
                          d="M2.01667 2.5L17.5 17.9833M8.58333 8.58333C8.08333 9.08333 7.83333 9.66667 7.83333 10.3333C7.83333 11.9667 9.2 13.3333 10.8333 13.3333C11.5 13.3333 12.0833 13.0833 12.5833 12.5833M4.93333 4.93333C3.66667 5.93333 2.66667 7.33333 2.01667 9.16667C2.01667 9.16667 4.16667 14.1667 10 14.1667C11.25 14.1667 12.3333 13.8333 13.25 13.3333L4.93333 4.93333ZM10 4.16667C15.8333 4.16667 17.9833 9.16667 17.9833 9.16667C17.5167 10.3167 16.7833 11.3167 15.85 12.1167L13.5833 9.85C14.0833 9.35 14.3333 8.76667 14.3333 8.1C14.3333 6.46667 12.9667 5.1 11.3333 5.1C10.6667 5.1 10.0833 5.35 9.58333 5.85L7.85 4.11667C8.76667 4.61667 9.85 4.91667 10 4.16667Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <p className="text-theme-xs text-gray-500">
              Toca el icono del lápiz en la foto para subir una imagen (JPG, PNG o WebP, máx. 5 MB).
            </p>
          </div>
        )}

        {!isEditing && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ProfileField label="Nombre completo" value={profile?.full_name ?? undefined} />
            <ProfileField label="Correo electrónico" value={user?.email ?? undefined} />
            <ProfileField label="Contraseña" value="••••••••" />
            <ProfileField label="Rol" value={role ? ROLE_LABELS[role] : undefined} />
          </div>
        )}
      </div>
    </form>
  );
}
