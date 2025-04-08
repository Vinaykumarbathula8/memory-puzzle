import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GameLevelScreen({ navigation }) {
  const levels = [
    { title: 'Easy', value: 'easy' },
    { title: 'Medium', value: 'medium' },
    { title: 'Hard', value: 'hard' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Memory Match Game</Text>
      <Text style={styles.subtitle}>Select a Level</Text>

      {levels.map((level) => (
        <TouchableOpacity
          key={level.value}
          style={styles.button}
          onPress={() => navigation.navigate('GameScreen', { level: level.value })}
        >
          <Text style={styles.btnText}>{level.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, color: '#ccc', marginBottom: 30 },
  button: { backgroundColor: '#4caf50', padding: 15, borderRadius: 10, marginBottom: 15, width: 200, alignItems: 'center' },
  btnText: { fontSize: 18, color: '#fff' },
});
