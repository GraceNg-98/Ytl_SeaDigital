import { ITransaction } from "../types";

export const groupTransactionByDate = (data: ITransaction[]) => {
    return data.reduce((result: any, item: ITransaction) => {
        const date: any = item.timestamp.split(' ')[0];
        if (!result[date]) {
            result[date] = [];
        }
        result[date].push(item);
        return result;
    }, {});
}

export const formatAmountValue = (value: any) => {
    return (Math.round(value * 100) / 100).toFixed(2);
}

export const maskSensitiveContent = (mask: boolean, str: string) => {
    if (!mask) {
        const test = str.toString().replace(/[0-9]/g, "x")
        return test
    } else return str
}