import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { GlobalColors } from '../styles/Colors';
import { globalStyles } from '../Resources';

const LeaderBoard = ({ rank, totalScore, todayScore }: any) => {
    return (
        < View style={styles.statsContainer} >
            <View style={[styles.statRankCard, styles.borderRight]}>
                <Text style={styles.statLabel}>My Rank</Text>
                <Text style={styles.rankValue}>#{rank ? rank : 0}</Text>
            </View>
            <View>
                <View>
                    <Text style={[globalStyles.textCenter, globalStyles.themeTextColor]}>Your Leaderboard insights</Text>
                </View>
                <View style={styles.statValuesRow}>
                    <View style={[globalStyles.padding]}>
                        <Text style={[styles.statValue, globalStyles.textCenter]}>{totalScore ? totalScore : 0}</Text>
                        <Text style={[styles.statLabel, , globalStyles.textCenter]}>Overall Score</Text>
                    </View>
                    <View style={[globalStyles.padding]}>
                        <Text style={[styles.statValue, globalStyles.textCenter]}>{todayScore ? todayScore : 0}</Text>
                        <Text style={[styles.statLabel, , globalStyles.textCenter]}>Today Score</Text>
                    </View>
                </View>
            </View>
        </View >
    )
}


const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#2e2e2e',
        borderRadius: 10,
        height: 110,
        marginBottom: 10,
    },
    statCard: {
        // alignItems: 'center',
    },
    statRankCard: {
        padding: 13,
        paddingLeft: 5,
        paddingRight: 15
    },
    borderRight: {
        borderRightWidth: 2,
        borderRightColor: GlobalColors.colors.primaryGrey
    },
    statLabel: {
        color: '#bbb',
        fontSize: 14,
    },
    statValue: {
        color: GlobalColors.colors.primaryColor,
        fontSize: 18,
        marginBottom: 2,
        marginTop: -5,
        fontWeight: 'bold',
    },
    rankValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5
    },
    statValuesRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 5
    },
});

export default LeaderBoard