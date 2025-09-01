import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function QRScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code</Text>
      <Image
        source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=VGC-HUB-DEMO' }}
        style={styles.qrImage}
      />
      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan QR</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>Show this QR code at check-in or scan another code.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181C24', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 18 },
  qrImage: { width: 180, height: 180, marginBottom: 24, backgroundColor: '#23283A', borderRadius: 18 },
  scanButton: { backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', width: 180, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 2 },
  scanButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  hint: { color: '#A0AEC0', fontSize: 14, marginTop: 8, textAlign: 'center' },
}); 