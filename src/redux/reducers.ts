import { SQLiteDatabase } from "react-native-sqlite-storage";
import { IAccount, ITransaction } from "../types";
import { ActionTypes } from "./actions";

export interface IState {
    accountList: IAccount[];
    transactionList: ITransaction[];
    isBiometriLogin: boolean;
    userId: string;
    databaseConnectionSetup: SQLiteDatabase | {};
}

const initState = (): IState => {
    const state: IState = {
        accountList: [],
        transactionList: [],
        isBiometriLogin: false,
        userId: "",
        databaseConnectionSetup: {}
    }
    return state
}

const reducer = (state = initState(), action: any) => {
    switch (action.type) {
        case ActionTypes.ACCOUNT_LIST:
            return {
                ...state, accountList: action.payload
            };
        case ActionTypes.TRANSACTION_LIST:
            return {
                ...state, transactionList: action.payload
            };
        case ActionTypes.IS_BIOMETRIC_LOGIN:
            return {
                ...state, isBiometriLogin: action.payload
            };
        case ActionTypes.USER_ID:
            return {
                ...state, userId: action.payload
            };
        case ActionTypes.DATABASE_CONNECTION_SETUP:
            return {
                ...state, databaseConnectionSetup: action.payload
            };
        default:
            return state;
    }
}

export { reducer as userReducer }