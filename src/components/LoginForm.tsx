'use client';

import { useState } from 'react';
import BrandLogo from '@/components/common/BrandLogo';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Complete correo y contraseña');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error ?? 'Credenciales inválidas');
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 flex justify-center">
        <BrandLogo variant="header" priority />
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">Iniciar sesión</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !email}
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && !password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeIcon className="size-5 fill-current" />
              ) : (
                <EyeCloseIcon className="size-5 fill-current" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-error-200 bg-error-50 px-3 py-2.5 text-sm text-error-600">
            {error}
          </p>
        )}

        <Button className="w-full !py-2.5" size="sm" disabled={loading} type="submit">
          {loading ? 'Ingresando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
