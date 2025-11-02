import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/themeColors';

const logo = require('../logo/logoopticalquality.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

function Sidebar({ visible, onClose }: SidebarProps) {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName as never);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sidebarContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}>
          <TouchableOpacity
            style={[styles.sidebar, { backgroundColor: colors.surface }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} resizeMode="contain" />
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContent}>
              <View style={styles.menuSection}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NAVEGACIÓN</Text>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation('DashboardHome')}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Text style={styles.menuIcon}>≡</Text>
                  </View>
                  <Text style={[styles.menuText, { color: colors.text }]}>Dashboard</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation('FormularioMedicion')}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Text style={styles.menuIcon}>+</Text>
                  </View>
                  <Text style={[styles.menuText, { color: colors.text }]}>Formulario de medición</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation('Formulas')}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Text style={styles.menuIcon}>∑</Text>
                  </View>
                  <Text style={[styles.menuText, { color: colors.text }]}>Fórmulas</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '75%',
  },
  sidebar: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    width: 120,
    height: 60,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Sidebar;
