import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Language</Text>
        <Text style={styles.value}>English</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Theme</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181C24',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingVertical: 14,
    backgroundColor: '#23283A',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  value: {
    fontSize: 16,
    color: '#3B82F6',
  },
}); 