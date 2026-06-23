# Usuarios de prueba

Contraseña **igual para los tres**:

```
OpticalTest2025!
```

| Email | Rol |
|-------|-----|
| `admin@test.com` | Administrador |
| `tecnico@test.com` | Técnico |
| `ti@test.com` | TI |

## Crear o actualizar en Supabase

```bash
npm run seed:test-users
```

Requiere `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, y haber ejecutado `supabase/schema.sql` antes.
