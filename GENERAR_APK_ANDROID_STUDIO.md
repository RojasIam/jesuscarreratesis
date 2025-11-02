# 📱 Generar APK con Android Studio (Forma Más Fácil)

## ✅ Ya está listo! El proyecto está configurado para Android Studio

## Pasos para generar la APK:

### 1️⃣ Abrir el proyecto en Android Studio

1. Abre **Android Studio**
2. Selecciona **"Open an Existing Project"**
3. Navega a la carpeta `D:\optical_quality\android`
4. Espera a que Android Studio sincronice el proyecto (puede tardar unos minutos la primera vez)

### 2️⃣ Generar la APK (2 opciones):

#### **Opción A: Build directo (más rápido)** ⚡

1. En Android Studio, ve al menú: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera a que termine (verás el progreso en la barra inferior)
3. Cuando termine, verás un popup: **"APK(s) generated successfully"**
4. Haz clic en **"locate"** para abrir la carpeta donde está la APK

La APK estará en:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

#### **Opción B: APK de producción (Release - más seguro)** 🔒

1. Ve a: **Build → Generate Signed Bundle / APK**
2. Selecciona **APK** y haz clic en **Next**
3. Si no tienes un keystore, crea uno:
   - Haz clic en **"Create new..."**
   - Rellena los datos (guardalos bien!)
   - Password y alias (apúntalos)
   - Click **OK** y luego **Next**
4. Selecciona **release** como build variant
5. Marca **"Export encrypted key for enrolling published apps in Google Play App Signing"** (opcional)
6. Click **Create**
7. La APK estará en:
   ```
   android\app\release\app-release.apk
   ```

---

## ⚠️ Si Android Studio te da errores:

### Error: "SDK location not found"
1. Ve a: **File → Project Structure → SDK Location**
2. Configura la ruta del Android SDK (normalmente: `C:\Users\[tu-usuario]\AppData\Local\Android\Sdk`)

### Error: "Gradle sync failed"
1. Ve a: **File → Sync Project with Gradle Files**
2. O: **File → Invalidate Caches / Restart → Invalidate and Restart**

### Error: Falta alguna dependencia
1. Android Studio normalmente las instala automáticamente
2. Si no, ve a: **Tools → SDK Manager** e instala lo que falta

---

## 📋 Comandos útiles (si prefieres terminal):

```bash
# Desde la carpeta raíz del proyecto
cd android
.\gradlew assembleDebug          # APK de debug
.\gradlew assembleRelease       # APK de release (requiere firma)
```

Las APK estarán en: `android\app\build\outputs\apk\`

---

## 🎯 Resumen rápido:

1. Abre Android Studio
2. Abre la carpeta `android` del proyecto
3. **Build → Build APK(s)**
4. ¡Listo! Ya tienes tu APK

---

## 💡 Tips:

- La APK **debug** es más fácil de generar (sin firma)
- La APK **release** es la que debes usar para distribuir (requiere firma)
- Guarda bien el keystore si creas uno, lo necesitarás para actualizaciones futuras
- La primera vez puede tardar más (descarga de dependencias)

