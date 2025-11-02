import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomPicker from '../components/CustomPicker';
import Sidebar from '../components/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import { useTheme } from '../context/ThemeContext';
import { getCommonStyles, getHeaderStyles } from '../styles/getThemedStyles';
import { getThemeColors } from '../styles/themeColors';
import { Image } from 'react-native';

const logo = require('../logo/logoopticalquality.png');
import { FormData, DEPARTAMENTOS_PERU } from '../types';
import {
  calculateILMax,
  evaluateStatus,
  getPowerColors,
  getEmpalmeColors,
  getConectorColors,
  getReflectanciaColors,
} from '../utils/calculations';

function FormularioMedicionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  
  const commonStyles = getCommonStyles(isDark);
  const headerStyles = getHeaderStyles(isDark);
  const colors = getThemeColors(isDark);
  
  const [formData, setFormData] = useState<FormData>({
    departamento: 'Lima',
    distrito: '',
    sede: '',
    tecnicoResponsable: '',
    codigoCircuito: '',
    clienteEmpresa: '',
    tipoBanda: '1310',
    potenciaSiteNodo: '',
    numeroEmpalmes: '',
    numeroConectores: '',
    distanciaEnlace: '',
    potenciaRecibidaRoseta: '',
    peorEmpalme: '',
    peorConector: '',
    reflectancia: '',
  });

  const [ilMax, setIlMax] = useState<number | null>(null);
  const [estado, setEstado] = useState<{
    estado: 'Excelente' | 'Bueno' | 'Regular' | 'No Conforme';
    backgroundColor: string;
    borderColor: string;
  } | null>(null);

  useEffect(() => {
    const parseNumber = (value: string | number | ''): number | '' => {
      if (value === '' || value === '-') return '';
      const strValue = String(value);
      if (strValue === '.' || strValue === ',') return '';
      const normalizedValue = strValue.replace(',', '.');
      const numValue = Number(normalizedValue);
      return isNaN(numValue) ? '' : numValue;
    };

    const parsedNumeroEmpalmes: number | '' = formData.numeroEmpalmes === '' ? '' : (typeof formData.numeroEmpalmes === 'number' ? formData.numeroEmpalmes : Number(formData.numeroEmpalmes));
    const parsedNumeroConectores: number | '' = formData.numeroConectores === '' ? '' : (typeof formData.numeroConectores === 'number' ? formData.numeroConectores : Number(formData.numeroConectores));
    
    const formDataForCalc: FormData = {
      ...formData,
      potenciaSiteNodo: parseNumber(formData.potenciaSiteNodo) as number | string | '',
      distanciaEnlace: parseNumber(formData.distanciaEnlace) as number | string | '',
      numeroEmpalmes: parsedNumeroEmpalmes,
      numeroConectores: parsedNumeroConectores,
      potenciaRecibidaRoseta: parseNumber(formData.potenciaRecibidaRoseta) as number | string | '',
      peorEmpalme: parseNumber(formData.peorEmpalme) as number | string | '',
      peorConector: parseNumber(formData.peorConector) as number | string | '',
      reflectancia: parseNumber(formData.reflectancia) as number | string | '',
    };

    const calculatedILMax = calculateILMax(formDataForCalc);
    setIlMax(calculatedILMax);

    if (calculatedILMax !== null && formDataForCalc.potenciaRecibidaRoseta !== '') {
      const ilReal = Number(formDataForCalc.potenciaRecibidaRoseta);
      const status = evaluateStatus(ilReal, calculatedILMax);
      setEstado(status);
    } else {
      setEstado(null);
    }
  }, [formData]);

  const handleChange = (name: string, value: string | number) => {
    if (name === 'potenciaSiteNodo' || name === 'potenciaRecibidaRoseta' || name === 'reflectancia') {
      let strValue = String(value).replace(',', '.');
      if (strValue === '' || strValue === '-' || strValue === '.' || /^-?\d*\.?\d*$/.test(strValue)) {
        setFormData((prev) => ({ ...prev, [name]: strValue }));
      }
    } else if (name === 'distanciaEnlace' || name === 'peorEmpalme' || name === 'peorConector') {
      let strValue = String(value).replace(',', '.');
      if (strValue === '' || strValue === '.' || /^\d*\.?\d*$/.test(strValue)) {
        setFormData((prev) => ({ ...prev, [name]: strValue }));
      }
    } else if (name === 'numeroEmpalmes' || name === 'numeroConectores') {
      const strValue = String(value);
      if (strValue === '' || /^\d*$/.test(strValue)) {
        const intValue = strValue === '' ? '' : parseInt(strValue, 10);
        setFormData((prev) => ({ ...prev, [name]: intValue }));
      }
    } else if (name === 'distrito' || name === 'tecnicoResponsable') {
      if (value === '' || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(String(value))) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === 'codigoCircuito') {
      if (value === '' || /^\d*$/.test(String(value))) {
        setFormData((prev) => ({ ...prev, [name]: String(value) }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    Alert.alert('Éxito', 'Formulario enviado correctamente');
  };

  const getFieldStyle = (name: string, value: string | number | '') => {
    const colors = getFieldColors(name, value);
    return {
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    };
  };

  const getFieldColors = (name: string, value: string | number | '') => {
    if (value === '' || value === '-') {
      return { backgroundColor: '#ffffff', borderColor: '#d1d5db' };
    }
    
    const strValue = String(value).replace(',', '.');
    const numValue = typeof value === 'string' ? Number(strValue) : value;
    if (isNaN(numValue) || strValue === '.') return { backgroundColor: '#ffffff', borderColor: '#d1d5db' };
    
    switch (name) {
      case 'potenciaSiteNodo':
        return getPowerColors(numValue);
      case 'peorEmpalme':
        return getEmpalmeColors(numValue);
      case 'peorConector':
        return getConectorColors(numValue);
      case 'reflectancia':
        return getReflectanciaColors(numValue);
      default:
        return { backgroundColor: '#ffffff', borderColor: '#d1d5db' };
    }
  };

  const getStatusColor = () => {
    if (!estado) return '#6b7280';
    switch (estado.estado) {
      case 'Excelente':
        return '#10b981';
      case 'Bueno':
        return '#f97316';
      case 'Regular':
        return '#eab308';
      case 'No Conforme':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={commonStyles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[headerStyles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={headerStyles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Text style={headerStyles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <Text style={headerStyles.headerTitle}>Formulario de Medición</Text>
        
        <View style={headerStyles.headerRight}>
          <View style={headerStyles.statusBadge}>
            <View style={headerStyles.statusIndicator} />
            <Text style={headerStyles.statusText}>Online</Text>
          </View>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: colors.themeToggleBg }]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={headerStyles.avatar}
            onPress={() => setProfileDropdownVisible(true)}
          >
            <Image source={logo} style={styles.avatarImage} resizeMode="cover" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summaryCards}>
          {ilMax !== null && (
            <View style={[styles.summaryCard, { backgroundColor: '#2563eb' }]}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardNumber}>{ilMax.toFixed(1)}</Text>
                  <Text style={styles.cardLabel}>IL_MAX (dBm)</Text>
                </View>
                <View style={styles.cardGraph}>
                  <Text style={styles.graphIcon}>📈</Text>
                </View>
              </View>
            </View>
          )}

          {formData.potenciaRecibidaRoseta && (
            <View style={[styles.summaryCard, { backgroundColor: '#06b6d4' }]}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardNumber}>{String(formData.potenciaRecibidaRoseta)}</Text>
                  <Text style={styles.cardLabel}>IL_REAL (dBm)</Text>
                </View>
                <View style={styles.cardGraph}>
                  <Text style={styles.graphIcon}>📊</Text>
                </View>
              </View>
            </View>
          )}

          {estado && (
            <View style={[styles.summaryCard, { backgroundColor: getStatusColor() }]}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardNumber}>{estado.estado}</Text>
                  <Text style={styles.cardLabel}>Estado</Text>
                </View>
                <View style={styles.cardGraph}>
                  <Text style={styles.graphIcon}>✓</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>1. Datos generales</Text>
          
          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Departamento *</Text>
            <CustomPicker
              selectedValue={formData.departamento}
              onValueChange={(value) => handleChange('departamento', value)}
              items={DEPARTAMENTOS_PERU.map((dept) => ({ label: dept, value: dept }))}
              placeholder="Seleccionar departamento"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Distrito *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.distrito}
              onChangeText={(value) => handleChange('distrito', value)}
              placeholder="Solo letras"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Sede *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.sede}
              onChangeText={(value) => handleChange('sede', value)}
              placeholder="Letras y números"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Técnico responsable *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.tecnicoResponsable}
              onChangeText={(value) => handleChange('tecnicoResponsable', value)}
              placeholder="Solo letras"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Código del circuito *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.codigoCircuito}
              onChangeText={(value) => handleChange('codigoCircuito', value)}
              placeholder="Solo números"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Cliente / Empresa *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.clienteEmpresa}
              onChangeText={(value) => handleChange('clienteEmpresa', value)}
              placeholder="Letras y números"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>2. Parámetros de medición</Text>
          
          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Tipo de banda *</Text>
            <CustomPicker
              selectedValue={formData.tipoBanda}
              onValueChange={(value) => handleChange('tipoBanda', value)}
              items={[
                { label: '1310', value: '1310' },
                { label: '1490', value: '1490' },
                { label: '1550', value: '1550' },
              ]}
              placeholder="Seleccionar tipo de banda"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Potencia Site - Nodo (dBm) *</Text>
            <TextInput
              style={[commonStyles.input, getFieldStyle('potenciaSiteNodo', formData.potenciaSiteNodo)]}
              value={formData.potenciaSiteNodo === '' ? '' : String(formData.potenciaSiteNodo)}
              onChangeText={(value) => handleChange('potenciaSiteNodo', value)}
              placeholder="Ej: -7.5"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Número de empalmes *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.numeroEmpalmes === '' ? '' : String(formData.numeroEmpalmes)}
              onChangeText={(value) => handleChange('numeroEmpalmes', value)}
              placeholder="Entero"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Número de conectores *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.numeroConectores === '' ? '' : String(formData.numeroConectores)}
              onChangeText={(value) => handleChange('numeroConectores', value)}
              placeholder="Entero"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Distancia del enlace (km) *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.distanciaEnlace === '' ? '' : String(formData.distanciaEnlace)}
              onChangeText={(value) => handleChange('distanciaEnlace', value)}
              placeholder="Decimal"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Potencia recibida (IL_REAL) (dBm) *</Text>
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text }]}
              value={formData.potenciaRecibidaRoseta === '' ? '' : String(formData.potenciaRecibidaRoseta)}
              onChangeText={(value) => handleChange('potenciaRecibidaRoseta', value)}
              placeholder="Decimal (puede ser negativo)"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>3. Indicadores de calidad</Text>
          
          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Peor empalme (dB) *</Text>
            <TextInput
              style={[
                commonStyles.input,
                { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text },
                getFieldStyle('peorEmpalme', formData.peorEmpalme)
              ]}
              value={formData.peorEmpalme === '' ? '' : String(formData.peorEmpalme)}
              onChangeText={(value) => handleChange('peorEmpalme', value)}
              placeholder="Decimal"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Peor conector (dB) *</Text>
            <TextInput
              style={[
                commonStyles.input,
                { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text },
                getFieldStyle('peorConector', formData.peorConector)
              ]}
              value={formData.peorConector === '' ? '' : String(formData.peorConector)}
              onChangeText={(value) => handleChange('peorConector', value)}
              placeholder="Decimal"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Reflectancia (dB) *</Text>
            <TextInput
              style={[
                commonStyles.input,
                { backgroundColor: colors.inputBackground, borderColor: colors.borderLight, color: colors.text },
                getFieldStyle('reflectancia', formData.reflectancia)
              ]}
              value={formData.reflectancia === '' ? '' : String(formData.reflectancia)}
              onChangeText={(value) => handleChange('reflectancia', value)}
              placeholder="Decimal (negativo)"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>4. Resultados calculados</Text>
          
          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>IL_MAX (dBm)</Text>
            <View style={[commonStyles.input, styles.readOnlyInput, { backgroundColor: colors.background }]}>
              <Text style={[styles.readOnlyText, { color: colors.text }]}>
                {ilMax !== null ? ilMax.toFixed(2) : '---'}
              </Text>
            </View>
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Estado de la medición</Text>
            <View
              style={[
                commonStyles.input,
                styles.readOnlyInput,
                estado ? { backgroundColor: estado.backgroundColor, borderColor: estado.borderColor } : { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.statusText, estado ? { color: estado.borderColor } : { color: colors.textMuted }]}>
                {estado?.estado || '---'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Guardar medición</Text>
        </TouchableOpacity>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <ProfileDropdown
        visible={profileDropdownVisible}
        onClose={() => setProfileDropdownVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCards: {
    marginBottom: 20,
    gap: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    fontWeight: '500',
  },
  cardGraph: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphIcon: {
    fontSize: 40,
    opacity: 0.3,
  },
  readOnlyInput: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#1f2937',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusTextEmpty: {
    color: '#9ca3af',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default FormularioMedicionScreen;

