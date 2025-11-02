# Optical Quality - Medición y Reportes (App Móvil)

Aplicación móvil React Native diseñada para calcular y reportar el estado de las mediciones en cajas de energía.

## Características

- Sistema de autenticación simple con correo electrónico y contraseña
- Formulario completo para captura de datos de medición
- Cálculo automático de pérdida óptica máxima permitida (IL_MAX)
- Evaluación automática del estado de la medición
- Indicadores visuales de color según los valores ingresados
- Interfaz optimizada para dispositivos móviles

## Requisitos

- Node.js 18+
- npm o yarn
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Para desarrollo móvil:
  - iOS: Xcode (solo macOS)
  - Android: Android Studio

## Instalación

1. Instalar las dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm start
```

3. Opciones para ejecutar:
   - Escanear QR con Expo Go (iOS/Android)
   - Presionar `i` para iOS Simulator (solo macOS)
   - Presionar `a` para Android Emulator
   - Presionar `w` para web

## Estructura del Proyecto

```
optical_quality/
├── src/
│   ├── screens/              # Pantallas de la aplicación
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardHomeScreen.tsx
│   │   ├── FormularioMedicionScreen.tsx
│   │   └── FormulasScreen.tsx
│   ├── components/           # Componentes reutilizables
│   │   ├── Sidebar.tsx
│   │   ├── ProfileDropdown.tsx
│   │   └── CustomPicker.tsx
│   ├── context/              # Contextos de React
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── styles/               # Estilos y temas
│   │   ├── themeColors.ts
│   │   └── getThemedStyles.ts
│   ├── logo/                 # Logo de la aplicación
│   │   └── logoopticalquality.png
│   ├── types.ts              # Definiciones de tipos TypeScript
│   └── utils/                # Utilidades
│       └── calculations.ts
├── App.tsx                    # Componente principal
├── app.json                   # Configuración de Expo
├── package.json
└── tsconfig.json
```

## Uso

### Login

El sistema utiliza un sistema de autenticación simple. Cualquier correo electrónico y contraseña válidos permitirán el acceso.

### Formulario de Medición

El formulario se divide en 4 secciones:

1. **Datos generales**: Información básica de la medición
2. **Parámetros de medición**: Valores técnicos de la medición
3. **Indicadores de calidad**: Métricas de calidad óptica
4. **Resultados calculados**: Valores calculados automáticamente

### Cálculos Automáticos

- **IL_MAX**: Se calcula automáticamente según la fórmula especificada
- **Estado**: Se evalúa automáticamente basado en IL_REAL e IL_MAX

### Indicadores de Color

Los campos cambian de color según los valores ingresados:

- **Verde**: Valores óptimos
- **Amarillo**: Valores aceptables pero con advertencia
- **Rojo**: Valores no conformes

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo de Expo
- `npm run android`: Inicia en Android
- `npm run ios`: Inicia en iOS (solo macOS)
- `npm run web`: Inicia en navegador web

## Tecnologías Utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage (para persistencia de autenticación y tema)
- React Native Safe Area Context

## Desarrollo

Esta aplicación está construida con Expo, lo que permite desarrollo rápido y fácil despliegue. Para más información sobre Expo, visita [expo.dev](https://expo.dev).

## Licencia

Este proyecto es de uso interno.
