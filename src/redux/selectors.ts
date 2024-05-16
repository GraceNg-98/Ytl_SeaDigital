import { SQLiteDatabase } from "react-native-sqlite-storage";
import { IAccount, ITransaction } from "../types";
import { IState } from "./reducers";

export const getAccountList = (state: IState) : IAccount[] => state.accountList;
export const getTransactionList = (state: IState) : ITransaction[] => state.transactionList;
export const getIsBiometricLogin = (state: IState) : boolean => state.isBiometriLogin;
export const getUserId = (state: IState) : string => state.userId;
export const getDatabaseConnection = (state: IState) : SQLiteDatabase | {} => state.databaseConnectionSetup;

