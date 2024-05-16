import ReactNativeBiometrics, { ReactNativeBiometricsLegacy } from "react-native-biometrics"
import { updateBioAuthLogin } from "../services/db"

export const createBiometricKey = async () => {
    const rnBiometrics = new ReactNativeBiometrics()
    const publicKey = await rnBiometrics.createKeys().then(resultObject => {
        return resultObject.publicKey
    })
    return publicKey.substring(0, 18);
}

export const checkBiometricExist = async () => {
    const rnBiometrics = new ReactNativeBiometrics()
    const keysExist = await rnBiometrics.biometricKeysExist().then(resultObject => {
        return resultObject.keysExist
    })
    return keysExist
}

export const handleRegisterBiometric = async (db: any, user: any): Promise<boolean> => {
    const publicKey = await createBiometricKey()
    if (publicKey) {
        const updateLogin = await updateBioAuthLogin(db, { ...user, isRegisterBiometric: true, biometricPublicKey: publicKey })
        if (updateLogin) {
            return true
        } else return false
    } else { return false }
}

export const authenticateBiometric = async () => {
    const result = await ReactNativeBiometricsLegacy.simplePrompt({
        promptMessage: 'Authenticate',
    });
    return result
}