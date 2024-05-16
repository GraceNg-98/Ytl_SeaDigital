
import { blue, grey, lightBlue, red } from "@mui/material/colors";
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { Image, Keyboard, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connectToDatabase, getBioAuthLogin, getLogin } from "../services/db";
import { ReactNativeBiometricsLegacy } from "react-native-biometrics";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import { RootStackParamList } from "../routes";
import React, { useEffect } from 'react';
import { HelperText, Snackbar, TextInput } from 'react-native-paper';
import AlertDialog from "../components/AlertDialog";
import { IUser } from "../types";
import { authenticateBiometric, checkBiometricExist, createBiometricKey, handleRegisterBiometric } from "../sagas/loginSaga";

type loginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<loginScreenProp>();
    const [db, setDatabase] = useState<SQLiteDatabase | {}>({});
    const [loginid, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const [user, setUser] = useState<IUser | {}>({})
    const [error, setError] = useState(false);
    const [isLoginPwdFail, setLoginPwdFail] = useState(false)
    const [isLoginBioFail, setLoginBioFail] = useState(false)
    const [isRegisterBio, setRegisterBio] = useState(false)
    const [isSuccessRegister, setSuccessRegister] = useState(false)

    useEffect(() => {
        const connect = async () =>
            await connectToDatabase().then(
                res => setDatabase(res)
            )
        connect()
    }, [(db == undefined)])

    const validateInput = () => {
        if (loginid.length == 0 || password.length == 0) {
            setError(true)
            return false
        }
        else return true
    }

    const routeToDashboard = (user: any, isBioLogin: boolean) => {
        navigation.navigate('Dashboard', { user: user, isBiometricLogin: isBioLogin });
        setUser({})
        setLoginId('')
        setPassword('')
    }

    const handleAuthenticate = async (isBiometricLogin: Boolean) => {
        try {
            const { available } = await ReactNativeBiometricsLegacy.isSensorAvailable();
            if (isBiometricLogin) {
                const keyExist = await checkBiometricExist()
                const publicKey = await createBiometricKey()
                if (keyExist && available) {
                    const result = await authenticateBiometric()
                    if (result.success) {
                        const isRegisteredBioLogin = await getBioAuthLogin(db, publicKey)
                        if (isRegisteredBioLogin.status) {
                            setUser(isRegisteredBioLogin.user)
                            routeToDashboard(isRegisteredBioLogin.user, true)
                        } else setLoginBioFail(true)
                    } else setLoginBioFail(true)
                } else {
                    setLoginBioFail(true)
                }
            } else {
                const login = await getLogin(db, loginid, password)
                if (login.status) {
                    setUser(login.user)
                    if (login?.user?.isRegisterBiometric) {
                        setRegisterBio(false)
                        routeToDashboard(login.user, false)
                    } else {
                        setRegisterBio(true)
                    }
                } else {
                    setLoginPwdFail(true)
                }
            }
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <View style={[styles.flex, styles.container]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View style={styles.flex}>
                    <SafeAreaView style={styles.flex}>
                        <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                source={require("../assets/image/login2.png")}
                                style={{ width: 250, height: 250 }} />
                            <Text style={styles.title}>
                                YTL Sea Digital Bank
                            </Text>
                        </View>
                    </SafeAreaView>
                    <View style={styles.subContainer}>
                        <View style={{ paddingTop: 25 }}>
                            <TextInput
                                label="Login id"
                                underlineColor={blue[400]}
                                style={styles.lightbg}
                                value={loginid}
                                onChangeText={text => setLoginId(text)}
                                error={(error && loginid.length == 0)}
                            />
                            <HelperText type="error" visible={(error && loginid.length == 0)}>
                                Please enter login id
                            </HelperText>
                            <TextInput
                                label="Password"
                                underlineColor={blue[400]}
                                style={styles.lightbg}
                                value={password}
                                onChangeText={text => setPassword(text)}
                                error={(error && password.length == 0)}
                                secureTextEntry
                            />
                            <HelperText type="error" visible={(error && password.length == 0)}>
                                Please enter password
                            </HelperText>
                        </View>
                        <View style={{ paddingVertical: 40 }}>
                            <View style={{ flexDirection: "column" }}>
                                <Pressable style={styles.button}
                                    onPress={() => {
                                        const isValid = validateInput()
                                        if (isValid) {
                                            handleAuthenticate(false)
                                        }
                                    }}>
                                    <Text style={{ textAlign: "center" }}>LOGIN</Text>
                                </Pressable>
                                <Text style={styles.subTitle}>
                                    OR
                                </Text>
                                <TouchableOpacity
                                    style={{ alignItems: 'center' }}
                                    onPress={() => {
                                        handleAuthenticate(true)
                                    }}>
                                    <Image
                                        source={require('../assets/image/biometric.png')}
                                        style={{ width: 30, height: 30, }}
                                    />
                                    <Text style={styles.iconButton}>
                                        Biometric Login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {isLoginPwdFail &&
                <AlertDialog
                    visible={isLoginPwdFail}
                    title="Authenticate Failed"
                    desc="Please enter valid login id and password"
                    buttonTitle="OK"
                    buttonAction={() => setLoginPwdFail(false)}
                />}
            {isLoginBioFail &&
                <AlertDialog
                    visible={isLoginBioFail}
                    title="Authenticate Failed"
                    desc="Please login with id and password"
                    buttonTitle="OK"
                    buttonAction={() => setLoginBioFail(false)}
                />}

            {isRegisterBio &&
                <AlertDialog
                    visible={isRegisterBio}
                    title="Register"
                    desc="Do you want to register biometric login for current login id ?"
                    buttonTitle="YES"
                    buttonAction={async () => {
                        setRegisterBio(false)
                        const isSuccess = await handleRegisterBiometric(db, user)
                        setSuccessRegister(isSuccess)
                    }}
                    secondButtonTitle="NO"
                    secondButtonAction={() => {
                        setRegisterBio(false)
                        routeToDashboard(user, false)
                    }}
                />}
            {isSuccessRegister && <Snackbar
                visible={isSuccessRegister}
                onDismiss={() => {
                    setSuccessRegister(false)
                    routeToDashboard(user, false)
                }}
                action={{
                    label: 'Close',
                    onPress: () => {
                        setSuccessRegister(false)
                        routeToDashboard(user, false)
                    },
                }}>
                Successfully register biometric login
            </Snackbar>}
        </View>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        backgroundColor: grey[900]
    },
    subContainer: {
        flex: 1.5,
        paddingHorizontal: 40,
        elevation: 10,
        shadowColor: red[800],
        backgroundColor: blue[100],
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    title: {
        color: lightBlue[50],
        fontSize: 20,
        fontFamily: "monospace"
    },
    subTitle: {
        color: grey[700],
        fontWeight: '800',
        fontSize: 24,
        textAlign: 'center',
        padding: 20
    },
    lightbg: {
        backgroundColor: blue[100]
    },
    button: {
        backgroundColor: lightBlue[500],
        padding: 15,
        borderRadius: 20
    },
    iconButton: {
        color: lightBlue[500],
        fontWeight: 'light',
        fontSize: 16,
    }
})


export default LoginScreen