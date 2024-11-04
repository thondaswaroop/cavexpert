import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../Resources';
import { GlobalColors } from '../../styles/Colors';

const ReviewAnswersScreen = ({ route }) => {
    const { questions = [], score = 0, totalQuestions = 0, correctAnswers = 0, title, id } = route.params || {};
    const navigation = useNavigation();

    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
    const [expandedExplanationIndex, setExpandedExplanationIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
    };

    const toggleExplanation = (index: number) => {
        setExpandedExplanationIndex(expandedExplanationIndex === index ? null : index);
    };

    const retakeQuiz = () => {
        const data = { 'title': title, id: id };
        console.log('data', data);
        navigation.navigate('ViewTopic', data);
    };

    return (
        <View style={globalStyles.mainContainer}>
            {/* Score Summary */}
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Final Score: {score} 🪙</Text>
                <Text style={styles.scoreText}>Correct Answers: {correctAnswers}/{totalQuestions}</Text>
            </View>

            {/* List of Questions */}
            <ScrollView style={styles.questionList}>
                {questions.map((question, index) => {
                    const isCorrect = question.correctAnswer === question.userSelectedAnswer;
                    const isQuestionExpanded = expandedQuestionIndex === index;
                    const isExplanationExpanded = expandedExplanationIndex === index;

                    return (
                        <View key={index} style={styles.questionContainer}>
                            {/* Question Title as Accordion Header */}
                            <TouchableOpacity onPress={() => toggleQuestion(index)}>
                                <Text style={styles.questionText}>{index + 1}. {question.title}</Text>
                            </TouchableOpacity>

                            {/* Options - Displayed only if the question is expanded */}
                            {isQuestionExpanded && question.options.map((option, optionIndex) => {
                                const isSelected = question.userSelectedAnswer === optionIndex;
                                const isCorrectAnswer = question.correctAnswer === optionIndex;

                                return (
                                    <View key={optionIndex} style={[
                                        styles.optionContainer,
                                        isCorrectAnswer ? styles.correctAnswer : {},
                                        isSelected && !isCorrect ? styles.incorrectAnswer : {},
                                    ]}>
                                        <Text style={[
                                            styles.optionText,
                                            isSelected ? styles.selectedOptionText : {}
                                        ]}>
                                            {optionIndex + 1}. {option}
                                        </Text>
                                    </View>
                                );
                            })}

                            {/* Explanation Toggle - Independent of question expansion */}
                            <TouchableOpacity onPress={() => toggleExplanation(index)} style={styles.explanationButton}>
                                <Text style={styles.explanationButtonText}>
                                    {isExplanationExpanded ? 'Hide Explanation' : 'Show Explanation'}
                                </Text>
                            </TouchableOpacity>

                            {/* Explanation Section - Displayed only if the explanation is expanded */}
                            {isExplanationExpanded && (
                                <View style={styles.explanationContainer}>
                                    <Text style={styles.explanationText}>{question.explanation}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={retakeQuiz}>
                    <Text style={styles.buttonText}>Retake Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home', { screen: 'HomeScreen' })}>
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReviewAnswersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scoreContainer: {
        padding: 20,
        backgroundColor: GlobalColors.colors.white,
        alignItems: 'center',
        marginBottom: 10,
    },
    scoreText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: GlobalColors.colors.primaryColor,
    },
    questionList: {
        padding: 10,
    },
    questionContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    optionContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 5,
        backgroundColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 16,
    },
    correctAnswer: {
        backgroundColor: '#C8E6C9',
    },
    incorrectAnswer: {
        backgroundColor: '#FFCDD2',
    },
    selectedOptionText: {
        fontWeight: 'bold',
    },
    explanationButton: {
        marginTop: 10,
    },
    explanationButtonText: {
        color: GlobalColors.colors.primaryColor,
        fontSize: 16,
        fontWeight: '600',
    },
    explanationContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    explanationText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: GlobalColors.colors.secondaryBlack,
    },
    button: {
        backgroundColor: GlobalColors.colors.primaryColor,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});
