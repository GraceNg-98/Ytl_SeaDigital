

import { blue, blueGrey, grey, lightBlue } from "@mui/material/colors";
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connectToDatabase, getAccount, getTransactionHistory } from "../services/db";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import { RootStackParamList } from "../routes";
import React, { useEffect } from 'react';
import { Card, Divider, Snackbar, Text } from 'react-native-paper';
import { IAccount, ITransaction, TransferType } from "../types";
import { formatAmountValue, groupTransactionByDate, maskSensitiveContent } from "../utils/utils"
import { authenticateBiometric } from "../sagas/loginSaga";


type dashboardScreenProps = StackNavigationProp<RootStackParamList, 'Dashboard'>;
const DashboardScreen = ({ route }: { route: any }) => {
    const navigation = useNavigation<dashboardScreenProps>();
    const [db, setDatabase] = useState<SQLiteDatabase | {}>({});

    const { user, isBiometricLogin } = route.params
    const [refreshing, setRefreshing] = useState(false);
    const [refreshScreen, setRefreshScreen] = useState(false);
    const [account, setAccount] = useState<IAccount[]>([])
    const [history, setHistory] = useState<ITransaction[]>([])
    const [groupHistory, setGroupHistory] = useState<ITransaction[]>([])
    const [biometricLogin, setBiometricLogin] = useState(isBiometricLogin)


    useEffect(() => {
        const connect = async () =>
            await connectToDatabase().then(
                res => setDatabase(res)
            )
        connect()
    }, [(db == undefined)])

    useEffect(() => {
        if (account.length == 0 && Object.keys(db).length !== 0) {
            const getAccountList = async () =>
                await getAccount(db, user.userId).then(
                    res => {
                        setAccount(res)
                    }
                )
            getAccountList()
        }
    }, [db, account])

    useEffect(() => {
        if (history.length == 0 && Object.keys(db).length !== 0) {
            const getTransaction = async () =>
                await getTransactionHistory(db, user.userId).then(
                    res => {
                        setHistory(res)
                        setGroupHistory(groupTransactionByDate(res))
                    }
                )
            getTransaction()
        }
    }, [db, history])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            setRefreshScreen(true)
        }, 2000);
    }, []);

    const getTotalBalance = () => {
        var total = 0
        account.map(item => {
            total = item.availableBalance + total
        })
        return (maskSensitiveContent(biometricLogin, total.toString()))
    }

    const getBiometricAuthentication = async () => {
        const result = await authenticateBiometric()
        if (result.success) {
            setBiometricLogin(true)
        }
    }

    const displayTransactionByDate = () => {
        return groupHistory && Object.keys(groupHistory).map((date, index) => {
            return (
                <View key={index} >
                    <Text style={styles.dateTitle}> {date}</Text>
                    {
                        groupHistory[date].map((item: any) => {
                            var isDebitTransfer = item.transactionType == TransferType.DEBIT
                            return <View key={index + item.transactionId}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (biometricLogin) {
                                            navigation.navigate('Detail', { details: item })
                                        } else {
                                            getBiometricAuthentication()
                                        }
                                    }}>
                                    <View style={styles.transactionCard}>
                                        <Image
                                            source={
                                                (isDebitTransfer ?
                                                    require('../assets/image/dollar.png') :
                                                    require('../assets/image/pay.png'))
                                            }
                                            style={{ width: 30, height: 30, marginRight: 8 }}
                                        />
                                        {isDebitTransfer ?
                                            <View>
                                                <Text>{item.fromAccountName}</Text>
                                                <Text>{maskSensitiveContent(biometricLogin, item.fromAccountNo)}</Text>
                                            </View> :
                                            <View>
                                                <Text>{item.toAccountName}</Text>
                                                <Text>{maskSensitiveContent(biometricLogin, item.toAccountNo)}</Text>
                                            </View>}

                                        <View style={styles.right}>
                                            <Text style={{ fontWeight: 700, color: blue[500] }}>
                                                {isDebitTransfer ? "+ " : "- "}
                                                {item.currency + " " + formatAmountValue(item.amount)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <Divider bold={true} />
                            </View>
                        })
                    }
                </View>
            )
        })
    };

    return <View style={[styles.container, styles.flex]}>
        <View style={[styles.logout, styles.right]}>
            <TouchableOpacity
                onPress={() => navigation.popToTop()}>
                <Image
                    source={require('../assets/image/logout.png')}
                    style={{ width: 25, height: 21 }}
                />
            </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.flex}>
            <View style={styles.subContainer}>
                <Text style={{ color: blueGrey[100] }}>
                    Total balance
                </Text>
                <View style={styles.row}>
                    <Text style={styles.whiteTitle}>
                        {getTotalBalance()}
                    </Text>
                    <Text style={styles.currencyTitle}>
                        MYR
                    </Text>
                    {
                        !biometricLogin &&
                        <View style={{ paddingTop: 15, marginHorizontal: 5 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    getBiometricAuthentication()
                                }}>
                                <Image
                                    source={require('../assets/image/eye_open.png')}
                                    style={{ width: 25, height: 21 }}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
            <SafeAreaView >
                <ScrollView
                    style={{ margin: 15 }}
                    horizontal={true}
                >
                    <View style={styles.row} >
                        {
                            account.map((item: any) => {
                                return <Card
                                    key={item.availableBalance + "_" + item.accountName}
                                    elevation={1}
                                    style={styles.cardContainer}>
                                    <Card.Title
                                        key={item.accountName}
                                        titleStyle={{ color: blueGrey[900] }}
                                        subtitleStyle={{ color: blueGrey[800] }}
                                        titleVariant="titleSmall"
                                        subtitleVariant="bodySmall"
                                        title={item.accountName}
                                        subtitle={item.accountCurrency + " " + maskSensitiveContent(biometricLogin, item.availableBalance)}
                                    />
                                </Card>
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Text style={styles.transactionTitle}>
                Transactions
            </Text>
            <SafeAreaView style={styles.transactionContainer}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View>
                        {displayTransactionByDate()}
                    </View>
                </ScrollView>
            </SafeAreaView>

        </SafeAreaView>
        {refreshScreen &&
            <Snackbar
                visible={refreshScreen}
                onDismiss={() => setRefreshScreen(false)}
            >
                Everything is updated !
            </Snackbar>}
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: grey[900]
    },
    logout: {
        paddingTop: 20,
        paddingRight: 15
    },
    right: {
        marginLeft: 'auto'
    },
    row: {
        flexDirection: 'row'
    },
    flex: { flex: 1 },
    subContainer: {
        margin: 20,
        marginBottom: 0
    },
    whiteTitle: {
        color: blueGrey[100],
        fontSize: 36,
        fontWeight: '600'
    },
    currencyTitle: {
        color: blueGrey[100],
        fontSize: 16,
        padding: 5,
        textAlignVertical: 'bottom'
    },
    dateTitle: {
        color: blueGrey[700],
        paddingTop: 20
    },
    transactionCard: {
        flexDirection: 'row',
        paddingVertical: 20
    },
    transactionContainer: {
        flex: 1,
        backgroundColor: lightBlue[50],
        shadowColor: blue[800],
        elevation: 30,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: 30
    },
    transactionTitle: {
        fontSize: 15,
        color: blueGrey[100],
        marginHorizontal: 20,
        marginVertical: 15
    },
    cardContainer: {
        backgroundColor: lightBlue[500],
        margin: 10,
        width: 200,
    }
})
export default DashboardScreen

