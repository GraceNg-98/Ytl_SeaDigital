export enum ActionTypes {
    ACCOUNT_LIST = 'user/ACCOUNT_LIST',
    TRANSACTION_LIST = 'user/TRANSACTION_LIST',
    IS_BIOMETRIC_LOGIN = 'user/IS_BIOMETRIC_LOGIN',
    USER_ID = 'user/USER_ID',
    DATABASE_CONNECTION_SETUP = 'user/DATABASE_CONNECTION_SETUP'
}

export const setAccountList = (payload: any) => ({
    type: ActionTypes.ACCOUNT_LIST,
    payload
})

export const setTransactionList = (payload: any) => ({
    type: ActionTypes.TRANSACTION_LIST,
    payload
})

export const setIsBiometricLogin = (payload: any) => ({
    type: ActionTypes.IS_BIOMETRIC_LOGIN,
    payload
})

export const setUserId = (payload: any) => ({
    type: ActionTypes.USER_ID,
    payload
})

export const setDatabaseConnection = (payload: any) => ({
    type: ActionTypes.DATABASE_CONNECTION_SETUP,
    payload
})