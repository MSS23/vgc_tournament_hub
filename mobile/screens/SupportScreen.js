import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const faqs = [
  { id: '1', question: 'How do I register for a tournament?', answer: 'Go to the Tournaments tab, select a tournament, and tap Register.' },
  { id: '2', question: 'How do I check in at an event?', answer: 'Go to the Tickets tab, select your ticket, and show your QR code at the event.' },
  { id: '3', question: 'How do I follow other players?', answer: 'Go to the Social tab, Discover section, and tap Follow on any account.' },
];

export default function SupportScreen() {
  const [supportMessage, setSupportMessage] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Support & FAQs</Text>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <FlatList
        data={faqs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.faqCard}>
            <Text style={styles.faqQ}>{item.question}</Text>
            <Text style={styles.faqA}>{item.answer}</Text>
          </View>
        )}
        scrollEnabled={false}
      />
      <Text style={styles.sectionTitle}>Contact Support</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={supportMessage}
        onChangeText={setSupportMessage}
        multiline
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => { setSupportMessage(''); setSubmitted(true); setTimeout(() => setSubmitted(false), 2000); }}
        disabled={!supportMessage.trim()}
      >
        <Text style={styles.buttonText}>{submitted ? 'Submitted!' : 'Send Message'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Report an Issue</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the issue..."
        value={reportMessage}
        onChangeText={setReportMessage}
        multiline
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => { setReportMessage(''); setReportSubmitted(true); setTimeout(() => setReportSubmitted(false), 2000); }}
        disabled={!reportMessage.trim()}
      >
        <Text style={styles.buttonText}>{reportSubmitted ? 'Reported!' : 'Report Issue'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181C24', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginTop: 18, marginBottom: 8 },
  faqCard: { backgroundColor: '#23283A', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  faqQ: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  faqA: { fontSize: 14, color: '#A0AEC0' },
  input: { backgroundColor: '#23283A', color: '#fff', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 10, borderWidth: 1, borderColor: '#3B82F6', minHeight: 44 },
  button: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 