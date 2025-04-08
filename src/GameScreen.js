import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const emojiByLevel = {
  easy: ['🐶', '🍕', '🎈', '🌟'],
  medium: ['🐶', '🍕', '🎈', '🌟', '🍎', '🚗'],
  hard: ['🐶', '🍕', '🎈', '🌟', '🍎', '🚗', '🎮', '🐱'],
};

const moveLimits = {
  easy: 10,
  medium: 16,
  hard: 22,
};

const generateCards = (emojis) => {
  const pairs = [...emojis, ...emojis];
  return pairs
    .map((emoji, index) => ({
      id: index + 1,
      emoji,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
};

export default function MemoryGame({ route, navigation }) {
  const { level } = route.params;

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const emojis = emojiByLevel[level];
    setCards(generateCards(emojis));
    setMoves(0);
    setFlippedCards([]);
  }, [level]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [i1, i2] = flippedCards;
      const updated = [...cards];

      if (updated[i1].emoji === updated[i2].emoji) {
        updated[i1].isMatched = true;
        updated[i2].isMatched = true;
      } else {
        setTimeout(() => {
          updated[i1].isFlipped = false;
          updated[i2].isFlipped = false;
          setCards([...updated]);
        }, 800);
      }

      setCards(updated);
      setFlippedCards([]);
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      Alert.alert('🎉 Level Complete!', `You won in ${moves} moves`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }

    const maxMoves = moveLimits[level];
    if (moves >= maxMoves) {
      Alert.alert('❌ You failed!', 'Try again', [
        { text: 'Retry', onPress: () => resetGame() },
        { text: 'Back', onPress: () => navigation.goBack() },
      ]);
    }
  }, [cards, moves]);

  const handleCardPress = (index) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedCards.length === 2) return;

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);
    setFlippedCards([...flippedCards, index]);
  };

  const resetGame = () => {
    const emojis = emojiByLevel[level];
    setCards(generateCards(emojis));
    setMoves(0);
    setFlippedCards([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Level: {level.toUpperCase()}</Text>
      <Text style={styles.moves}>
        Moves: {moves}/{moveLimits[level]}
      </Text>

      <View style={styles.grid}>
        {cards.map((card, idx) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              (card.isFlipped || card.isMatched) && styles.cardFlipped,
            ]}
            onPress={() => handleCardPress(idx)}
          >
            <Text style={styles.emoji}>
              {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>⬅️ Back to Levels</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 40, alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  moves: { fontSize: 16, color: '#ccc', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '90%' },
  card: {
    width: '21%',
    aspectRatio: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    margin: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFlipped: {
    backgroundColor: '#4caf50',
  },
  emoji: { fontSize: 28 },
  backBtn: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2196f3',
    borderRadius: 8,
  },
  backText: { color: '#fff', fontSize: 16 },
});
