import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavbarProps {
  activeTab: 'Inicio' | 'Medicos' | 'Citas' | 'Reportes';
  navigation?: any; // Añádelo si usas router para navegar
}

export default function BottomNavbar({ activeTab }: NavbarProps) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem}>
        <View style={[styles.iconCircle, activeTab === 'Inicio' && styles.activeCircle]}>
          <Ionicons name="home" size={22} color={activeTab === 'Inicio' ? '#0b7a75' : '#7f8c8d'} />
        </View>
        <Text style={[styles.navText, activeTab === 'Inicio' && styles.activeText]}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <View style={[styles.iconCircle, activeTab === 'Medicos' && styles.activeCircle]}>
          <Ionicons name="medical" size={22} color={activeTab === 'Medicos' ? '#0b7a75' : '#7f8c8d'} />
        </View>
        <Text style={[styles.navText, activeTab === 'Medicos' && styles.activeText]}>Medicos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <View style={[styles.iconCircle, activeTab === 'Citas' && styles.activeCircle]}>
          <Ionicons name="calendar" size={22} color={activeTab === 'Citas' ? '#0b7a75' : '#7f8c8d'} />
        </View>
        <Text style={[styles.navText, activeTab === 'Citas' && styles.activeText]}>Citas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <View style={[styles.iconCircle, activeTab === 'Reportes' && styles.activeCircle]}>
          <Ionicons name="document-text" size={22} color={activeTab === 'Reportes' ? '#0b7a75' : '#7f8c8d'} />
        </View>
        <Text style={[styles.navText, activeTab === 'Reportes' && styles.activeText]}>Reportes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#0b7a75',
    height: 75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  activeCircle: {
    backgroundColor: '#ffffff',
  },
  navText: {
    color: '#a3cbc9',
    fontSize: 11,
  },
  activeText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});