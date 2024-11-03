import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Alert, BackHandler,Share } from 'react-native';
import { globalStyles, imagesBucket } from '../../Resources'; // Assuming you have global styles
import { GlobalColors } from '../../styles/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { httpService } from '../../services/api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loggerService, socialShare } from '../../utils/CommonUtils';
import { useLoader } from '../../utils/common/LoaderContext';
import { useToast } from 'react-native-toast-notifications';
import { showToast } from '../../utils/common/ToastUtil';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo
import { FAB } from 'react-native-paper';
import { AppEnvironment } from '../../constants/Global';

const QuizResultsScreen = ({ route, navigation }: any) => {
    const { score, correctAnswers, totalQuestions, title, id, questions } = route.params;
    const [userID, setUserID] = useState<string | null>(null);
    const toast = useToast();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const id = await AsyncStorage.getItem('UserId');
                setUserID(id);
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };

        fetchUserID();
    }, []);

    const calculateGrade = () => {
        const percentage = (correctAnswers / totalQuestions) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        return 'C';
    };

    useEffect(() => {
        navigation.setOptions({
            title: 'Quiz Completed!',
            headerLeft: () => (''), // Empty header left (can customize as needed)
            headerRight: () => (
                <TouchableOpacity onPress={showExitConfirmation} style={globalStyles.headerButton}>
                    <Image source={imagesBucket.closeIcon} style={globalStyles.iconImage} />
                </TouchableOpacity>
            ),
        });

        const saveProgress = async () => {
            if (!userID) return; // Ensure userID is available

            // Check internet connectivity
            const netInfo = await NetInfo.fetch();
            if (!netInfo.isConnected) {
                showToast('warning', toast, 'Internet connection is not available. Quiz results cannot be saved.');
                return; // Exit if offline
            }

            let postData = {
                userID,
                quizId: id,
                score,
                correctAnswers,
                totalQuestions,
                questions,
            };

            showLoader();
            httpService.post<any>('saveQuizProgress', postData).then((response: any) => {
                hideLoader();
                showToast('success', toast, response.message); // Changed to 'success' for successful save
                loggerService('default', 'Save Quiz Response : ', response);
            }).catch((error: any) => {
                hideLoader();
                loggerService('error', 'Save Quiz Error Response : ', error);
            });
        };

        saveProgress();
    }, [score, correctAnswers, totalQuestions, questions, id, userID, navigation]);

    const showExitConfirmation = () => {
        Alert.alert(
            "Exit Quiz",
            "Do you really want to exit the quiz? All progress will be lost.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                showExitConfirmation();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const renderBadge = () => {
        const grade = calculateGrade();
        switch (grade) {
            case 'A+':
                return imagesBucket.badge_gold; // Gold badge image
            case 'A':
                return imagesBucket.badge_silver; // Silver badge image
            case 'B':
                return imagesBucket.badge_bronze; // Bronze badge image
            default:
                return imagesBucket.badge_participation; // Participation image
        }
    };

    const shareResult = ()=>{
        socialShare(
            AppEnvironment.MainLogo,
          '🚀 I just leveled up in "The Man Cave"! 🚀',
          "I scored "+score+" points in the latest quiz about Attracting the Right Person! 📚💡With "+correctAnswers+" correct answers, I'm learning how to understand myself better and become the best version of me. 💪 \n\n Think you can beat my score? 🏆 Join me in The Man Cave and discover what it takes to attract the right people into your life and build real, lasting relationships. \n\n ❤️ Click the link to download the app and start your journey now: [https://play.google.com/store/apps/details?id=com.whatsapp] \n 📲 Download The Man Cave and challenge yourself today!",
          AppEnvironment.StoreLink
        );
    }

    return (
        <View style={globalStyles.mainContainer}>
            <View style={[globalStyles.padding, globalStyles.mTop20]}>
                <Text style={styles.heading}>Quiz Completed!</Text>

                <View style={styles.scoreCard}>
                    <Text style={styles.scoreText}>Score: {score} Points</Text>
                    <Text style={styles.resultText}>{correctAnswers}/{totalQuestions} Correct</Text>

                    <View style={styles.badgeContainer}>
                        <Image source={renderBadge()} style={styles.badgeImage} />
                        <Text style={styles.gradeText}>Grade: {calculateGrade()}</Text>
                    </View>
                    <View style={styles.sharePlacement}>
                        <FAB icon="share" onPress={()=>shareResult()} style={styles.shareIcon} color={GlobalColors.colors.primaryColor}></FAB>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressTitle}>Your Progress</Text>
                    <View style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                { width: `${(correctAnswers / totalQuestions) * 100}%` },
                            ]}
                        />
                    </View>
                </View>
                <View style={[globalStyles.mTop20, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ReviewAnswersScreen', {
                                questions: questions, // Pass the updated questions array
                                score: score,
                                correctAnswers: correctAnswers,
                                totalQuestions: totalQuestions,
                                title,
                                id
                            })
                        }
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Review Answers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'HomeScreen' })} style={[styles.button, styles.secondaryButton]}>
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: GlobalColors.colors.white,
        marginTop: 20,
        textAlign: 'center',
    },
    scoreCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: GlobalColors.colors.primaryColor,
    },
    resultText: {
        fontSize: 18,
        color: '#777',
        marginVertical: 10,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    badgeImage: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    gradeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    progressTitle: {
        fontSize: 18,
        color: '#fff',
    },
    progressBarBackground: {
        width: '80%',
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginTop: 10,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: GlobalColors.colors.primaryColor,
        borderRadius: 5,
    },
    button: {
        backgroundColor: GlobalColors.colors.primaryColor,
        marginVertical: 10,
        width: '50%',
        padding: 15,
        margin: 3,
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginHorizontal: -2,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderColor: GlobalColors.colors.primaryColor,
        borderWidth: 2,
    },
    secondaryButtonText: {
        color: GlobalColors.colors.primaryColor,
    },
    sharePlacement: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        // top:10
    },
    shareIcon: {
        backgroundColor: GlobalColors.colors.white,
        color: GlobalColors.colors.white
    }
});

export default QuizResultsScreen;
