import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { globalStyles } from '../Resources';

interface QuestionComponentProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  feedback: { [key: number]: 'correct' | 'wrong' };
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  feedback
}) => {
  return (
    <View style={styles.container}>
      {/* Question Text */}
      <Text style={[styles.questionText, globalStyles.themeTextColor]}>{question}</Text>

      {/* Options */}
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          let backgroundColor = '#fff';
          let borderColor = '#e0e0e0';

          // Immediate color change when an option is selected
          if (selectedAnswer === index) {
            backgroundColor = '#ccc'; // Grey for selected option
          }

          // Feedback after pressing "Next"
          if (selectedAnswer !== null) {
            if (feedback[selectedAnswer] === 'wrong' && selectedAnswer === index) {
              backgroundColor = '#ff6f6f'; // Red for wrong answer
            } else if (feedback[selectedAnswer] === 'correct' && selectedAnswer === index) {
              backgroundColor = '#4caf50'; // Green for selected correct answer
            } else if (feedback[index] === 'correct') {
              backgroundColor = '#4caf50'; // Green for the correct answer
            }
          }

          return (
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor, borderColor }]}
              onPress={() => onSelectAnswer(index)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default QuestionComponent;
