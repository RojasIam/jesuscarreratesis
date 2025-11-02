import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sidebar from '../components/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';
import { useTheme } from '../context/ThemeContext';
import { getCommonStyles, getHeaderStyles } from '../styles/getThemedStyles';
import { getThemeColors } from '../styles/themeColors';
import { Image } from 'react-native';

const logo = require('../logo/logoopticalquality.png');

function DashboardHomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  
  const commonStyles = getCommonStyles(isDark);
  const headerStyles = getHeaderStyles(isDark);
  const colors = getThemeColors(isDark);

  return (
    <View style={commonStyles.container}>
      <View style={[headerStyles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={headerStyles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Text style={headerStyles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
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
      >
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>Bienvenido</Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>Dashboard de Mediciones Ópticas</Text>

        <View style={styles.actionCards}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#2563eb' }]}
            onPress={() => navigation.navigate('FormularioMedicion' as never)}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardTitle}>Nueva Medición</Text>
                <Text style={styles.cardDescription}>Registrar nueva medición óptica</Text>
              </View>
              <Text style={styles.cardIcon}>📝</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#06b6d4' }]}
            onPress={() => navigation.navigate('Formulas' as never)}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardTitle}>Fórmulas</Text>
                <Text style={styles.cardDescription}>Ver y editar fórmulas</Text>
              </View>
              <Text style={styles.cardIcon}>📐</Text>
            </View>
          </TouchableOpacity>
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
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  actionCards: {
    marginBottom: 24,
    gap: 16,
  },
  actionCard: {
    borderRadius: 16,
    padding: 24,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  cardIcon: {
    fontSize: 48,
    opacity: 0.3,
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

export default DashboardHomeScreen;

