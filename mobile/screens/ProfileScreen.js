import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '../App';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.info}>{user.division} Division • {user.region}</Text>
      <Text style={styles.sectionTitle}>Achievements</Text>
      <FlatList
        data={user.achievements}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Text style={styles.achievement}>• {item}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181C24',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    marginTop: 24,
  },
  info: {
    fontSize: 15,
    color: '#A0AEC0',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  achievement: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#23283A',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
}); 