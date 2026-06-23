# Optical Quality - Web App (Next.js)

Aplicación web profesional para calcular y reportar mediciones de calidad óptica.

## Stack

- **Next.js 15** — App Router, SSR/SSG
- **React 19** — UI
- **TypeScript** — Tipado estático
- **Tailwind CSS** — Estilos utility-first
- **Lucide React** — Iconos
- **Supabase** — Base de datos
- **Cloudinary** — Almacenamiento de archivos

## Variables de entorno

Copia `.env.example` a `.env.local` y pega tus credenciales:

```bash
cp .env.example .env.local
```

| Variable | Dónde obtenerla | Uso |
|----------|-----------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Cliente + servidor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → anon public | Cliente + servidor |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → service_role | **Solo servidor** |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary → Account Details | Servidor |
| `CLOUDINARY_API_KEY` | Cloudinary → API Key | **Solo servidor** |
| `CLOUDINARY_API_SECRET` | Cloudinary → API Secret | **Solo servidor** |

## Características

- Interfaz tipo app (responsive + PWA instalable)
- Login con persistencia de sesión
- Formulario de medición con cálculos en tiempo real
- Modo claro / oscuro
- Sidebar en desktop, drawer en móvil

## Configuración Supabase (obligatorio)

1. En **Supabase → SQL Editor**, ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql).
2. En **Authentication → Users**, crea un usuario (email + contraseña) para iniciar sesión.
3. Verifica la conexión: con la app en marcha, abre `/api/health`.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # pegar credenciales Supabase + Cloudinary
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Producción

```bash
npm run build
npm run start
```

Despliegue recomendado en **Vercel** (creadores de Next.js).

## Despliegue en GitHub + Vercel

Repositorio: [github.com/RojasIam/jesuscarreratesis](https://github.com/RojasIam/jesuscarreratesis)

### 1. Subir el código a GitHub

```bash
git remote add origin https://github.com/RojasIam/jesuscarreratesis.git
git add .
git commit -m "Migración a Next.js 15 — Optical Quality web app"
git push -u origin master
```

Si GitHub usa `main` como rama por defecto:

```bash
git branch -M main
git push -u origin main
```

### 2. Conectar Vercel (despliegue automático)

1. Entra en [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. **Add New → Project** → importa `RojasIam/jesuscarreratesis`.
3. Vercel detecta **Next.js** automáticamente. No cambies el build command (`npm run build`).
4. En **Environment Variables**, añade las mismas variables que en `.env.local`:

   | Variable | Entornos |
   |----------|----------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development |
   | `CLOUDINARY_CLOUD_NAME` | Production, Preview, Development |
   | `CLOUDINARY_API_KEY` | Production, Preview, Development |
   | `CLOUDINARY_API_SECRET` | Production, Preview, Development |

5. Pulsa **Deploy**. Cada `git push` a la rama conectada volverá a desplegar automáticamente.

### 3. Supabase en producción

En **Supabase → Authentication → URL Configuration**, añade la URL de Vercel (ej. `https://tu-proyecto.vercel.app`) en **Site URL** y **Redirect URLs**.

Si la base de datos ya existía antes del perfil con avatar, ejecuta también [`supabase/migrations/20250621000000_profile_avatar.sql`](supabase/migrations/20250621000000_profile_avatar.sql).

### 4. Verificar despliegue

Tras el deploy, abre `https://tu-dominio.vercel.app/api/health` — debe responder JSON con estado de Supabase y Cloudinary.

## Estructura

```
src/
├── app/              # Rutas Next.js (App Router)
│   ├── login/
│   └── (dashboard)/  # Rutas protegidas
├── components/       # UI reutilizable
├── context/          # Auth, Theme
└── lib/              # types, calculations
```

## Licencia

Uso interno.
