# 📱 Guía: Builds para iOS y Android

## ❓ ¿Hay que hacer builds por separado?

### Respuesta corta: **NO, pero depende de lo que necesites**

---

## 🎯 Escenarios diferentes:

### 1️⃣ **DESARROLLO Y PRUEBAS** (Lo que haces mientras programas)

**✅ UN SOLO CÓDIGO, funciona en ambos:**

```bash
npm start
```

Esto inicia el servidor y funciona para:
- **iOS**: Escanea QR con Expo Go en iPhone
- **Android**: Escanea QR con Expo Go en Android
- **Simuladores**: Presiona `i` para iOS o `a` para Android

**👉 El código es el mismo, no necesitas hacer nada por separado**

---

### 2️⃣ **GENERAR APPS FINALES** (Para distribuir/instalar)

**Aquí sí tienes opciones:**

#### **Opción A: Ambos juntos** (Una sola vez) ⚡

```bash
npm run build:all
```

Esto genera:
- APK para Android
- IPA para iOS

**Todo en un solo comando** ✅

---

#### **Opción B: Por separado** (Si solo necesitas uno) 📦

```bash
# Solo Android
npm run build:android
# O con Android Studio
npm run android:build-debug

# Solo iOS
npm run build:ios
```

**Útil si solo necesitas una plataforma** ✅

---

## 🔄 Flujo típico de trabajo:

### **Día a día (Desarrollo):**
```
npm start  → Probar en iOS y Android al mismo tiempo
```

### **Generar versión final:**
```
npm run build:all  → Genera APK + IPA juntos
```

O si solo necesitas Android:
```
npm run android:build-debug  → Solo APK
```

---

## 📊 Comparación:

| Escenario | Comando | iOS | Android |
|-----------|---------|-----|---------|
| **Desarrollo** | `npm start` | ✅ | ✅ |
| **Build ambos** | `npm run build:all` | ✅ | ✅ |
| **Build Android solo** | `npm run android:build-debug` | ❌ | ✅ |
| **Build iOS solo** | `npm run build:ios` | ✅ | ❌ |

---

## 💡 Recomendación:

### **Para desarrollo:**
- Usa **`npm start`** → Funciona para ambos automáticamente

### **Para generar apps:**
- Si necesitas ambas: **`npm run build:all`** (una vez, genera ambas)
- Si solo necesitas Android: **`npm run android:build-debug`** (más rápido)
- Si solo necesitas iOS: **`npm run build:ios`**

---

## ✅ Resumen:

- **Código**: Mismo código para iOS y Android (React Native)
- **Desarrollo**: Un solo comando (`npm start`) para ambos
- **Builds**: Puedes hacerlos juntos o por separado, tú decides

**¡No necesitas mantener dos proyectos diferentes!** 🎉

