import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Animated, Easing,Linking } from 'react-native';
import Ficon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlobalColors } from '../styles/Colors';
import { globalStyles } from '../Resources';

const ExplanationModal = ({ visible, onClose, explanation, link, story, result, onContinue }: any) => {
    console.log('link',link);
    const pulseAnimation = useRef(new Animated.Value(1)).current; // Initialize for pulse animation
    const shakeAnimation = useRef(new Animated.Value(0)).current; // Initialize for shake animation

    useEffect(() => {
        if (visible) {
            if (result === 'correct') {
                // Pulse animation for correct answer
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnimation, {
                            toValue: 1.2,
                            duration: 400,
                            easing: Easing.ease,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnimation, {
                            toValue: 1,
                            duration: 400,
                            easing: Easing.ease,
                            useNativeDriver: true,
                        }),
                    ]),
                    { iterations: 3 } // Pulse 3 times
                ).start();
            } else if (result === 'wrong') {
                // Shake animation for wrong answer
                Animated.sequence([
                    Animated.timing(shakeAnimation, {
                        toValue: 10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnimation, {
                        toValue: -10,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnimation, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }
    }, [result, visible]);

    const shakeStyle = {
        transform: [
            { translateX: shakeAnimation }
        ],
    };

    const pulseStyle = {
        transform: [
            { scale: pulseAnimation }
        ],
    };

    const openURL = ((urlLink:any)=>{
        Linking.openURL(urlLink);
    })

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        {result === 'correct' && (
                            <Animated.View style={[styles.animationContainer, pulseStyle]}>
                                <Text style={[styles.animationText, styles.modalTitle]}>

                                    <Ficon name='emoticon-happy-outline' color={GlobalColors.colors.primaryColor} size={30} /> &nbsp;
                                    Correct Answer!</Text>
                            </Animated.View>
                        )}
                        {result === 'wrong' && (
                            <Animated.View style={[styles.animationContainer, shakeStyle]}>
                                <Text style={[styles.animationText, styles.modalTitle]}>
                                    <Ficon name='emoticon-sad-outline' color={GlobalColors.colors.primaryColor} size={30} /> &nbsp; Wrong Choice
                                </Text>
                            </Animated.View>
                        )}
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={globalStyles.mBottom20}>
                            {result === 'correct' && (
                                <Text style={styles.modalSubtitle}>Nice work! Here's something extra to deepen your understanding.</Text>
                            )}
                            {result === 'wrong' && (
                                <Text style={styles.modalSubtitle}>Great Effort! But here's what you need to know</Text>
                            )}
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Insight</Text>
                            <Text style={[styles.modalText]}>{explanation}</Text>
                            <TouchableOpacity style={styles.anchorTagDesign} ><Text style={[globalStyles.anchorTag,{fontSize:13}]} onPress={() => openURL(link)}>Click here</Text></TouchableOpacity>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Story</Text>
                            <Text style={[styles.modalText]}>{story} </Text>
                            <TouchableOpacity style={styles.anchorTagDesign}><Text style={[globalStyles.anchorTag,{fontSize:13}]} onPress={() => openURL(link)}>Click here</Text></TouchableOpacity>
                        </View>
                    </ScrollView>

                    <TouchableOpacity onPress={onContinue} style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: '100%',
        height: '75%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    modalHeader: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: GlobalColors.colors.lightGrey,
        padding: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    modalContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 3,
        marginBottom: 15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        borderBottomColor: GlobalColors.colors.secondaryGrey,
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 24,
    },
    continueButton: {
        backgroundColor: GlobalColors.colors.primaryColor,
        paddingVertical: 15,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    continueButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    animationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    animationText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    anchorTagDesign: {
        flex:1,
        textAlign:'right',
        justifyContent:'flex-end',
        alignItems:'flex-end',
        marginTop:5
    }
});

export default ExplanationModal;
