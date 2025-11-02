# ✅ Siguiente Paso: Configurar Proyecto

## 🔐 Ya iniciaste sesión en el dashboard web - Ahora necesitas iniciar sesión en la terminal

---

## Paso 1: Iniciar sesión en EAS CLI

Abre tu terminal (PowerShell o CMD) y ejecuta:

```bash
eas login
```

Te pedirá:
- Email o username: `andresrp0795@gmail.com` (o el que usaste)
- Password: Tu contraseña de Expo

**Nota:** Si usaste "Iniciar con Google", necesitarás crear una contraseña o usar el token de acceso.

---

## Paso 2: Configurar el proyecto

Una vez iniciado sesión, ejecuta:

```bash
eas build:configure
```

Te hará algunas preguntas - presiona Enter para usar los valores por defecto:
- ¿Which workflow would you like to set up? → `build` (Enter)
- ¿What would you like to name your build profile? → `preview` (Enter)

---

## Paso 3: Generar ambas apps

Una vez configurado, ejecuta:

```bash
npm run build:all
```

O directamente:

```bash
eas build --platform all --profile preview
```

Esto generará:
- ✅ APK para Android
- ✅ IPA para iOS

---

## ⏱️ Tiempo estimado:

- Login: 1 minuto
- Configuración: 2 minutos  
- Build: 30-40 minutos
- **Total: ~35-45 minutos**

---

## 📋 Resumen de comandos:

```bash
# 1. Iniciar sesión (ingresa tus credenciales)
eas login

# 2. Configurar proyecto (solo primera vez)
eas build:configure

# 3. Generar ambas apps
npm run build:all
```

---

## 🆘 Si tienes problemas con el login:

### Si usaste "Iniciar con Google":
Puede que necesites crear una contraseña en Expo o usar un token:

```bash
# Opción 1: Crear contraseña en https://expo.dev/settings
# Opción 2: Usar token
eas login --token
```

### Si no recuerdas tu contraseña:
1. Ve a: https://expo.dev/forgot-password
2. Ingresa tu email
3. Sigue las instrucciones

---

## ✅ Después del build:

Recibirás:
- 📱 Link para descargar APK (Android)
- 📱 Link para descargar IPA (iOS)

O puedes verlos en:
https://expo.dev/accounts/andresrp0795/builds

---

## 💡 Tip:

Mientras se compila, puedes cerrar la terminal - recibirás un email cuando termine.

