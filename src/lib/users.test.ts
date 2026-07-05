import { describe, expect, it } from 'vitest';
import { buildFullName, validateCreateUserPayload, validateUpdateUserPayload } from '@/lib/users';

describe('users', () => {
  it('valida payload de creación', () => {
    expect(
      validateCreateUserPayload({
        nombres: 'Ana',
        apellidos: 'López',
        phone: '999888777',
        email: 'ana@test.com',
        password: '12345678',
        role: 'tecnico',
      }),
    ).toBeNull();
  });

  it('rechaza email inválido', () => {
    expect(
      validateCreateUserPayload({
        nombres: 'Ana',
        apellidos: 'López',
        phone: '999',
        email: 'no-email',
        password: '12345678',
        role: 'admin',
      }),
    ).toBe('Correo electrónico inválido');
  });

  it('valida actualización con contraseña opcional', () => {
    expect(
      validateUpdateUserPayload({
        nombres: 'Ana',
        apellidos: 'López',
        phone: '999',
        email: 'ana@test.com',
        role: 'tecnico',
      }),
    ).toBeNull();
  });

  it('rechaza contraseña corta al editar', () => {
    expect(
      validateUpdateUserPayload({
        nombres: 'Ana',
        apellidos: 'López',
        phone: '999',
        email: 'ana@test.com',
        role: 'tecnico',
        password: '123',
      }),
    ).toBe('La contraseña debe tener al menos 8 caracteres');
  });
});
