import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sidebar from '../components/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import { useTheme } from '../context/ThemeContext';
import { getCommonStyles, getHeaderStyles } from '../styles/getThemedStyles';
import { getThemeColors } from '../styles/themeColors';
import { commonStyles } from '../styles/commonStyles';
import { Image } from 'react-native';

const logo = require('../logo/logoopticalquality.png');

function FormulasScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  
  const themedCommonStyles = getCommonStyles(isDark);
  const headerStyles = getHeaderStyles(isDark);
  const colors = getThemeColors(isDark);

  return (
    <View style={themedCommonStyles.container}>
      <View style={[headerStyles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={headerStyles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Text style={headerStyles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <Text style={headerStyles.headerTitle}>Fórmulas</Text>
        
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={themedCommonStyles.section}>
          <Text style={themedCommonStyles.sectionTitle}>Fórmula principal: IL_MAX</Text>
          <View style={[styles.formulaBox, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
            <Text style={[styles.formulaText, { color: colors.text }]}>
              IL_MAX = Potencia Site-Nodo - (Atenuacion x Distancia) - (Empalmes x Perdida Empalme) - (Conectores x Perdida Conector) - 1
            </Text>
          </View>
        </View>

        <View style={themedCommonStyles.section}>
          <Text style={themedCommonStyles.sectionTitle}>Evaluación del estado</Text>
          <View style={[styles.evaluationCard, { backgroundColor: colors.background }]}>
            <View style={styles.evaluationItem}>
              <View style={[styles.statusDot, styles.dotGreen]} />
              <View style={styles.evaluationText}>
                <Text style={[styles.evaluationTitle, { color: colors.text }]}>Excelente</Text>
                <Text style={[styles.evaluationCondition, { color: colors.textSecondary }]}>IL_REAL {'<='} 0.75 x IL_MAX</Text>
              </View>
            </View>
            <View style={styles.evaluationItem}>
              <View style={[styles.statusDot, styles.dotOrange]} />
              <View style={styles.evaluationText}>
                <Text style={[styles.evaluationTitle, { color: colors.text }]}>Bueno</Text>
                <Text style={[styles.evaluationCondition, { color: colors.textSecondary }]}>IL_REAL {'<='} 0.90 x IL_MAX</Text>
              </View>
            </View>
            <View style={styles.evaluationItem}>
              <View style={[styles.statusDot, styles.dotYellow]} />
              <View style={styles.evaluationText}>
                <Text style={[styles.evaluationTitle, { color: colors.text }]}>Regular</Text>
                <Text style={[styles.evaluationCondition, { color: colors.textSecondary }]}>IL_REAL {'<='} IL_MAX</Text>
              </View>
            </View>
            <View style={styles.evaluationItem}>
              <View style={[styles.statusDot, styles.dotRed]} />
              <View style={styles.evaluationText}>
                <Text style={[styles.evaluationTitle, { color: colors.text }]}>No Conforme</Text>
                <Text style={[styles.evaluationCondition, { color: colors.textSecondary }]}>IL_REAL {'>'} IL_MAX</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={themedCommonStyles.section}>
          <Text style={themedCommonStyles.sectionTitle}>Indicadores de color</Text>
          
          <View style={[styles.indicatorCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.indicatorTitle, { color: colors.text }]}>Potencia Site-Nodo (dBm)</Text>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorGreen]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Verde: x {'>='} -7</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorYellow]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Amarillo: -9.5 {'<='} x {'<'} -7</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorRed]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Rojo: x {'<'} -9.5</Text>
            </View>
          </View>

          <View style={[styles.indicatorCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.indicatorTitle, { color: colors.text }]}>Peor empalme (dB)</Text>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorGreen]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Verde: x {'<'} 0.8</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorYellow]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Amarillo: 0.8 {'<='} x {'<'} 1</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorRed]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Rojo: x {'>='} 1</Text>
            </View>
          </View>

          <View style={[styles.indicatorCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.indicatorTitle, { color: colors.text }]}>Peor conector (dB)</Text>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorGreen]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Verde: x {'<'} 1</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorYellow]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Amarillo: 1 {'<='} x {'<'} 1.3</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorRed]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Rojo: x {'>='} 1.3</Text>
            </View>
          </View>

          <View style={[styles.indicatorCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.indicatorTitle, { color: colors.text }]}>Reflectancia (dB)</Text>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorGreen]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Verde: x {'<='} -40</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorYellow]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Amarillo: -40 {'<'} x {'<='} -35</Text>
            </View>
            <View style={styles.indicatorRow}>
              <View style={[styles.colorBox, commonStyles.colorRed]} />
              <Text style={[styles.indicatorText, { color: colors.text }]}>Rojo: x {'>'} -35</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <ProfileDropdown
        visible={profileDropdownVisible}
        onClose={() => setProfileDropdownVisible(false)}
      />
    </View>
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
  formulaBox: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  formulaText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 24,
  },
  evaluationCard: {
    borderRadius: 8,
    padding: 12,
  },
  evaluationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  dotGreen: {
    backgroundColor: '#10b981',
  },
  dotOrange: {
    backgroundColor: '#f97316',
  },
  dotYellow: {
    backgroundColor: '#eab308',
  },
  dotRed: {
    backgroundColor: '#ef4444',
  },
  evaluationText: {
    flex: 1,
  },
  evaluationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  evaluationCondition: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  indicatorCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  indicatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  indicatorText: {
    fontSize: 14,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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

export default FormulasScreen;
