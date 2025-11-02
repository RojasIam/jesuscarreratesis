# 🛠️ Herramientas Necesarias para Generar Apps (iOS + Android)

## ✅ Para generar ambas plataformas a la vez

### Opción 1: EAS Build (Recomendado - Más fácil) ☁️

#### Herramientas necesarias:

1. **Node.js y npm** ✅ (Ya lo tienes)
2. **Cuenta de Expo (gratuita)** - Crear en: https://expo.dev/signup
3. **EAS CLI** (ya está instalado cuando ejecutas el comando)

#### Pasos:

```bash
# 1. Iniciar sesión en Expo (solo la primera vez)
eas login

# 2. Configurar proyecto (solo la primera vez)
eas build:configure

# 3. Generar ambas apps
npm run build:all
```

**Tiempo estimado:** 15-30 minutos (se compila en la nube)

**Ventajas:**
- ✅ No necesitas Mac para iOS
- ✅ No necesitas Android Studio instalado
- ✅ Todo desde la terminal
- ✅ Funciona en Windows

---

### Opción 2: Build Local (Requiere más herramientas) 💻

#### Para Android:
1. **Android Studio** - Descargar: https://developer.android.com/studio
2. **Android SDK** (se instala con Android Studio)
3. **JDK** (Java Development Kit)

#### Para iOS:
1. **Mac con macOS** (requisito de Apple)
2. **Xcode** (desde App Store, ~12GB)
3. **Apple Developer Account** (gratuita para desarrollo, $99/año para App Store)

---

## 📋 Resumen: Qué necesitas para `npm run build:all`

### Mínimo necesario:
1. ✅ **Node.js** (ya lo tienes)
2. ✅ **Internet** (para EAS Build)
3. ⚠️ **Cuenta Expo** (gratuita, 2 minutos crear)
4. ✅ **EAS CLI** (se instala automáticamente)

### NO necesitas:
- ❌ Mac
- ❌ Android Studio instalado
- ❌ Xcode
- ❌ Cuentas de desarrollador pagadas (solo para distribución en tiendas)

---

## 🚀 Guía rápida para empezar:

### 1. Crear cuenta Expo (si no tienes):
```
Ve a: https://expo.dev/signup
Regístrate (gratis)
```

### 2. Iniciar sesión:
```bash
eas login
```
Te pedirá email y contraseña

### 3. Generar ambas apps:
```bash
npm run build:all
```

### 4. Esperar y descargar:
- Recibirás links para descargar:
  - APK (Android)
  - IPA (iOS)
- O ver en: https://expo.dev/accounts/[tu-usuario]/builds

---

## ⏱️ Tiempos estimados:

| Acción | Tiempo |
|--------|--------|
| Crear cuenta Expo | 2 min |
| Iniciar sesión | 1 min |
| Build Android | 10-15 min |
| Build iOS | 15-20 min |
| **Total** | **~30-40 min** |

---

## 💰 Costos:

- ✅ **EAS Build (preview)**: Gratis (hasta 30 builds/mes)
- ✅ **Cuenta Expo**: Gratis
- ✅ **Android Studio**: Gratis (si lo instalas)
- ⚠️ **Xcode**: Gratis (pero requiere Mac)
- 💰 **Apple Developer**: $99/año (solo si quieres publicar en App Store)

---

## ✅ Checklist rápido:

- [ ] Node.js instalado ✅
- [ ] Cuenta Expo creada (gratuita)
- [ ] Ejecutar `eas login`
- [ ] Ejecutar `npm run build:all`

**¡Eso es todo!** 🎉

---

## 🆘 Si tienes problemas:

### "EAS CLI no encontrado"
```bash
npm install -g eas-cli
```

### "Necesitas iniciar sesión"
```bash
eas login
```

### "Proyecto no configurado"
```bash
eas build:configure
```

---

## 📝 Nota importante:

**Para desarrollo diario** (pruebas):
- Solo necesitas `npm start`
- Funciona en iOS y Android con Expo Go
- No necesitas nada más

**Para generar apps finales:**
- Necesitas cuenta Expo + EAS Build
- Todo lo demás es opcional

