import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const mockAccounts = [
  { id: '1', name: 'Sarah Chen', isFollowing: true },
  { id: '2', name: 'David Kim', isFollowing: false },
  { id: '3', name: 'Alex Rodriguez', isFollowing: true },
  { id: '4', name: 'Emily Davis', isFollowing: false },
];

const myActivity = [
  { id: 'a1', text: 'Placed 1st at Phoenix Regional Championships.' },
  { id: 'a2', text: 'Liked a blog post.' },
  { id: 'a3', text: 'Followed Sarah Chen.' },
];

const followingActivity = [
  { id: 'f1', text: 'Sarah Chen placed 2nd at San Diego Regional.' },
  { id: 'f2', text: 'Alex Rodriguez posted a new blog.' },
];

export default function SocialScreen() {
  const [tab, setTab] = useState('Following');
  const [accounts, setAccounts] = useState(mockAccounts);

  const handleFollowToggle = (id) => {
    setAccounts(accs => accs.map(acc => acc.id === id ? { ...acc, isFollowing: !acc.isFollowing } : acc));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'Following' && styles.activeTab]} onPress={() => setTab('Following')}>
          <Text style={[styles.tabText, tab === 'Following' && styles.activeTabText]}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'Discover' && styles.activeTab]} onPress={() => setTab('Discover')}>
          <Text style={[styles.tabText, tab === 'Discover' && styles.activeTabText]}>Discover</Text>
        </TouchableOpacity>
      </View>
      {tab === 'Following' ? (
        <>
          <Text style={styles.sectionTitle}>Your Recent Activity</Text>
          <FlatList
            data={myActivity}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Text style={styles.activity}>• {item.text}</Text>}
            contentContainerStyle={{ paddingBottom: 12 }}
          />
          <Text style={styles.sectionTitle}>Following Activity</Text>
          <FlatList
            data={followingActivity}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <Text style={styles.activity}>• {item.text}</Text>}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Discover Accounts</Text>
          <FlatList
            data={accounts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.accountRow}>
                <Text style={styles.accountName}>{item.name}</Text>
                <TouchableOpacity
                  style={[styles.followButton, item.isFollowing ? styles.unfollow : styles.follow]}
                  onPress={() => handleFollowToggle(item.id)}
                >
                  <Text style={styles.followButtonText}>{item.isFollowing ? 'Unfollow' : 'Follow'}</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181C24', padding: 16 },
  tabRow: { flexDirection: 'row', marginBottom: 16, justifyContent: 'center' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#3B82F6', backgroundColor: '#23283A' },
  tabText: { fontSize: 16, color: '#A0AEC0', fontWeight: 'bold' },
  activeTabText: { color: '#3B82F6' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginBottom: 8, marginTop: 12 },
  activity: { fontSize: 15, color: '#fff', marginBottom: 6 },
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#23283A', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  accountName: { fontSize: 15, color: '#fff' },
  followButton: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 6 },
  follow: { backgroundColor: '#3B82F6' },
  unfollow: { backgroundColor: '#6B7280' },
  followButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
}); 