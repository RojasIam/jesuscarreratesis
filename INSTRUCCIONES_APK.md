# Instrucciones para crear la APK

## Método 1: Build en la nube con EAS (Recomendado) 🌐

### Pasos:

1. **Instalar EAS CLI globalmente (si no está instalado):**
   ```bash
   npm install -g eas-cli
   ```

2. **Iniciar sesión en tu cuenta de Expo:**
   ```bash
   eas login
   ```
   - Si no tienes cuenta, crea una en: https://expo.dev/signup

3. **Configurar el proyecto:**
   ```bash
   eas build:configure
   ```

4. **Crear la APK:**
   ```bash
   eas build --platform android --profile preview
   ```
   
   Esto iniciará el build en los servidores de Expo. El proceso puede tardar 10-20 minutos.

5. **Descargar la APK:**
   - Una vez completado, recibirás un enlace para descargar la APK
   - O puedes verla en: https://expo.dev/accounts/[tu-usuario]/builds

---

## Método 2: Build local (Requiere más configuración) 💻

### Requisitos previos:
- Android Studio instalado
- Android SDK configurado
- Variables de entorno ANDROID_HOME configuradas

### Pasos:

1. **Instalar dependencias de desarrollo:**
   ```bash
   npx expo install expo-dev-client
   ```

2. **Prebuild del proyecto:**
   ```bash
   npx expo prebuild --platform android
   ```

3. **Compilar localmente:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **La APK estará en:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## Método 3: Build local con EAS (Intermedio) ⚡

Si prefieres hacer el build localmente pero usando EAS:

1. **Configurar build local:**
   ```bash
   eas build --platform android --profile preview --local
   ```

   Esto descargará las dependencias necesarias y hará el build en tu máquina.

---

## Notas importantes:

- **Package name:** `com.opticalquality.app` (configurado en `app.json`)
- **Versión:** 1.0.0 (puedes cambiarla en `app.json`)
- **Version Code:** 1 (incrementa cada vez que subas una nueva versión)

## Próximos pasos:

1. Ejecuta el método que prefieras
2. Una vez tengas la APK, puedes instalarla directamente en dispositivos Android
3. Para distribuir, puedes subirla a Google Play Store o compartirla manualmente

---

## Comandos útiles:

```bash
# Ver estado de builds
eas build:list

# Ver detalles de un build específico
eas build:view [build-id]

# Cancelar un build en progreso
eas build:cancel [build-id]
```

