import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const posts = [
  { id: '1', title: 'Official VGC 2024 Meta Analysis', author: 'Manraj Sidhu', summary: 'Insights into the current VGC 2024 Regulation H meta.' },
  { id: '2', title: 'Building Teams for Success', author: 'Sarah Chen', summary: 'A comprehensive guide to team building.' },
  { id: '3', title: 'Community Spotlight: Rising Stars', author: 'Marcus Johnson', summary: 'Spotlight on rising stars in the VGC community.' },
];

export default function BlogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blog</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.author}>by {item.author}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>+ Create New Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181C24',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#23283A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: '#A0AEC0',
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
    color: '#fff',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
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