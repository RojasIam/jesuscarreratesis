# 📱 Generar App para iOS

## ✅ Tu app funciona en iOS y Android

La aplicación está configurada para ambas plataformas. Sin embargo, hay diferencias importantes:

---

## 🍎 Para iOS: Requisitos y Opciones

### ⚠️ Limitación importante:
- **iOS requiere macOS**: Apple solo permite compilar apps iOS en Mac con Xcode
- **Si tienes Windows/Linux**: No puedes generar la app iOS directamente

### ✅ Pero tienes estas opciones:

---

## Opción 1: Desarrollo y Pruebas con Expo Go 📲

**Funciona en iOS y Android desde cualquier sistema operativo:**

```bash
npm start
```

Luego:
- Escanea el QR con **Expo Go** en tu iPhone
- O presiona `i` si tienes simulador iOS configurado

**✅ Funciona desde Windows/Mac/Linux**

---

## Opción 2: Build en la nube con EAS (iOS desde Windows) ☁️

**Puedes generar la app iOS desde Windows usando EAS Build:**

```bash
npm run build:ios
```

Esto compila en servidores de Expo en macOS y te entrega el archivo `.ipa` listo.

**✅ Funciona desde Windows** (requiere cuenta Expo gratuita)

---

## Opción 3: Si tienes Mac con Xcode 💻

Si tienes acceso a una Mac:

### Pasos:

1. **Generar proyecto iOS nativo:**
   ```bash
   npx expo prebuild --platform ios
   ```

2. **Abrir en Xcode:**
   - Abre `ios/OpticalQuality.xcworkspace` en Xcode
   - Selecciona tu dispositivo o simulador
   - Presiona **Play** ▶️ o **Cmd + R**

3. **Generar IPA (para distribución):**
   - En Xcode: **Product → Archive**
   - Luego: **Distribute App**

---

## 📋 Resumen de opciones:

| Opción | Requisito | Plataforma |
|--------|-----------|------------|
| **Expo Go** | Ninguno | iOS ✅ / Android ✅ |
| **EAS Build iOS** | Cuenta Expo | iOS ✅ (desde Windows) |
| **Xcode directo** | Mac + Xcode | iOS ✅ |
| **Android Studio** | Android Studio | Android ✅ |

---

## 🎯 Para tu caso (Windows):

### Desarrollo y Pruebas:
- **iOS**: Usa Expo Go en tu iPhone (escanea QR)
- **Android**: Usa Expo Go o Android Studio

### Generar Apps Finales:
- **Android**: Android Studio o `npm run android:build-debug` ✅
- **iOS**: `npm run build:ios` (EAS Build en la nube) ☁️

---

## 🔧 Comandos útiles:

```bash
# Iniciar servidor (funciona iOS y Android)
npm start

# Build Android APK
npm run android:build-debug

# Build iOS IPA (en la nube)
npm run build:ios

# Build ambos en la nube
npx eas build --platform all --profile preview
```

---

## 💡 Recomendación:

1. **Para desarrollo**: Usa Expo Go (funciona en iOS y Android)
2. **Para Android APK**: Usa Android Studio (ya está configurado)
3. **Para iOS IPA**: Usa EAS Build desde la nube (no necesitas Mac)

**¡Tu app está lista para ambas plataformas!** 🎉

