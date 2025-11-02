import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/themeColors';

interface ProfileDropdownProps {
  visible: boolean;
  onClose: () => void;
}

function ProfileDropdown({ visible, onClose }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login' as never);
    onClose();
  };

  const handleViewProfile = () => {
    Alert.alert('Perfil', 'Funcionalidad de perfil próximamente');
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
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={[styles.dropdown, { backgroundColor: colors.surface }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Ver perfil</Text>
            </TouchableOpacity>
            
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuText, styles.logoutText]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    alignItems: 'flex-end',
  },
  dropdown: {
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: 18,
    width: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutText: {
    color: '#dc2626',
  },
  separator: {
    height: 1,
    marginVertical: 4,
  },
});

export default ProfileDropdown;

