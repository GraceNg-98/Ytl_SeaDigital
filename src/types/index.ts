
export interface IUser {
    userId: string;
    userName: string;
    loginid: string;
    password: string;
    isRegisterBiometric: boolean;
    biometricPublicKey?: string;
}

export interface IUserResp {
    user: IUser | { isRegisterBiometric: false, userId: string };
    status: boolean;
    message: string;
}

export interface IAccount {
    accountName: string;
    accountNo: string;
    availableBalance: number;
    accountCurrency: string;
    accountType: string;
}

export interface ITransaction {
    toAccountNo: string;
    toAccountName: string;
    fromAccountNo: string;
    fromAccountName: string;
    transactionId?: string;
    recipientReference: string;
    amount: number;
    currency: string;
    timestamp: string;
    referenceNo: string;
    transactionStatus: string;
    transactionType: string;
}

export enum TransferType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT"
}