
import { grey, lightBlue, blue, green, red } from '@mui/material/colors';
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatAmountValue } from '../utils/utils';
import { TransferType } from '../types';
import { Divider, Text } from 'react-native-paper';


const TransactionDetailScreen = ({ route }: { route: any }) => {
    const { details } = route.params
    const isDebitTransfer = details.transactionType == TransferType.DEBIT

    return <View style={styles.container}>
        <View style={styles.padding}>
            <Text style={isDebitTransfer ? styles.debit : styles.credit}>
                {isDebitTransfer ? "+ " : "- "}
                {details.currency + " " + formatAmountValue(details.amount)}
            </Text>

            <Text style={styles.title}>
                {isDebitTransfer ?
                    `Duitnow Transfer from ${details.fromAccountName}` :
                    `Duitnow Transfer to ${details.toAccountName}`
                }
            </Text>
        </View>
        <SafeAreaView style={styles.subContainer}>
            <ScrollView>
                <View>
                    <View>
                        <Text style={styles.subTitle}>
                            {isDebitTransfer ? "From" : "To"}
                        </Text>
                        <Text style={styles.detailTitle}>
                            {isDebitTransfer ?
                                details.fromAccountNo : details.toAccountNo
                            }
                        </Text>
                    </View>
                    <Divider style={styles.divider} />

                    <Text style={styles.subTitle}>
                        Recipient Reference
                    </Text>
                    <Text style={styles.detailTitle}>{details.recipientReference}</Text>
                    <Divider style={styles.divider} />

                    <Text style={styles.subTitle}>
                        Other Payment Detials
                    </Text>
                    <Text style={styles.detailTitle}>-</Text>
                    <Divider style={styles.divider} />

                    <Text style={styles.subTitle}>
                        Reference No
                    </Text>
                    <Text style={styles.detailTitle}>{details.referenceNo}</Text>
                    <Divider style={styles.divider} />

                    <Text style={styles.subTitle}>
                        Transaction Date
                    </Text>
                    <Text style={styles.detailTitle}>{details.timestamp}</Text>
                    <Divider style={styles.divider} />
                </View>
            </ScrollView>
        </SafeAreaView>
    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: grey[900]
    },
    subContainer: {
        flex: 1,
        backgroundColor: lightBlue[50],
        shadowColor: blue[800],
        elevation: 30,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: 30,
        paddingTop: 10
    },
    debit: {
        fontSize: 30,
        fontWeight: 700,
        color: green[400]
    },
    credit: {
        fontSize: 30,
        fontWeight: 700,
        color: red[500]
    },
    title: {
        color: grey[50],
        paddingVertical: 10,
        fontSize: 16
    },
    subTitle: {
        color: blue[900],
        fontSize: 12,
        paddingTop: 20,
        opacity: .7
    },
    detailTitle: {
        color: grey[900],
        fontSize: 16,
        fontWeight: 600
    },
    divider: {
        marginVertical: 10,
        backgroundColor: blue[500]
    },
    padding: {
        padding: 20
    }
});

export default TransactionDetailScreen