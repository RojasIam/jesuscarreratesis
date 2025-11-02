# 🚀 Pasos para Generar Apps de Ambas Plataformas

## ✅ Verificación de herramientas

### Ya tienes instalado:
- ✅ Node.js v22.20.0
- ✅ npm 10.9.3
- ✅ EAS CLI (se instalará en el primer comando)

---

## 📋 Checklist de inicio (solo primera vez):

### 1. Crear cuenta Expo (GRATIS)
1. Ve a: https://expo.dev/signup
2. Regístrate (puedes usar Google/GitHub)
3. Confirma tu email

**Tiempo: 2 minutos** ⏱️

---

### 2. Iniciar sesión en EAS
```bash
eas login
```
- Te pedirá email y contraseña de Expo
- Solo lo haces una vez

**Tiempo: 1 minuto** ⏱️

---

### 3. Configurar proyecto (solo primera vez)
```bash
eas build:configure
```
- Confirma las preguntas con Enter (usar valores por defecto)

**Tiempo: 1 minuto** ⏱️

---

## 🎯 Generar ambas apps (una sola vez):

```bash
npm run build:all
```

Esto generará:
- ✅ APK para Android
- ✅ IPA para iOS

**Tiempo estimado: 30-40 minutos** ⏱️

---

## 📥 Descargar las apps:

Una vez terminado:

1. **Opción 1**: Te dará links directos en la terminal
2. **Opción 2**: Ve a: https://expo.dev/accounts/[tu-usuario]/builds

Descargas:
- `app-debug.apk` → Para Android
- `app.ipa` → Para iOS

---

## 🔄 Procesos futuros (después de la primera vez):

Solo necesitas:
```bash
npm run build:all
```

Ya no necesitas:
- ❌ Volver a iniciar sesión (se guarda)
- ❌ Reconfigurar (ya está configurado)

---

## 💡 Resumen rápido:

**Primera vez (setup):**
1. Crear cuenta Expo (https://expo.dev/signup)
2. `eas login`
3. `eas build:configure`
4. `npm run build:all`

**Próximas veces:**
1. `npm run build:all` ✅

---

## ⚠️ Si algo falla:

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Project not configured"
```bash
eas build:configure
```

---

## 📊 Resumen de herramientas necesarias:

| Herramienta | ¿Ya la tienes? | ¿Necesitas instalarla? |
|-------------|----------------|------------------------|
| Node.js | ✅ Sí | No |
| npm | ✅ Sí | No |
| EAS CLI | ⚠️ Se instala con el comando | Se instala automáticamente |
| Cuenta Expo | ❌ No | Sí (gratis, 2 min) |
| Internet | ✅ Sí | No |

---

## 🎉 ¡Eso es todo!

**Con solo:**
1. Cuenta Expo (gratis)
2. `npm run build:all`

**Tienes ambas apps generadas** 🚀

