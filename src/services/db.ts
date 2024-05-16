import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from "react-native-sqlite-storage"
import { IAccount, ITransaction, IUser, IUserResp } from "../types"
import uuid from 'react-native-uuid';

enablePromise(true)

export const connectToDatabase = async () => {
  console.log("YASUO connectToDatabase")
  return openDatabase(
    { name: "ytlSeaDigital.db", location: "default" },
    () => { },
    (error: any) => {
      console.error(error)
      throw Error("Could not connect to database")
    }
  )
}

export const createTables = async (db: SQLiteDatabase) => {
  const userProfileQuery = `
      CREATE TABLE Users (
        id TEXT,
        username TEXT,
        loginid TEXT,
        password TEXT,
        registerbio BOOL,
        biometrickey TEXT,
        PRIMARY KEY(id)
      )
    `
  const userAccountQuery = `
    CREATE TABLE IF NOT EXISTS Accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_name TEXT,
      account_no TEXT,
      available_balance INT,
      currency TEXT,
      account_type TEXT,
      user_id TEXT NOT NULL,
      FOREIGN KEY (user_id)
        REFERENCES Users (id)
    )
  `
  const transactionQuery = `
     CREATE TABLE IF NOT EXISTS Transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        to_account_no TEXT,
        to_account_name TEXT, 
        from_account_no TEXT, 
        from_account_name TEXT,
        transaction_id TEXT,
        recipient_reference TEXT, 
        amount DOUBLE, 
        currency TEXT,
        timestamp TEXT,
        reference_no TEXT,
        transaction_status TEXT, 
        transaction_type TEXT,
        user_id TEXT NOT NULL,
        FOREIGN KEY (user_id)
          REFERENCES Users (id)
     )
    `
  try {
    await db.executeSql(userProfileQuery)
    await db.executeSql(userAccountQuery)
    await db.executeSql(transactionQuery)
  } catch (error) {
    console.error(error)
    throw Error(`Failed to create tables`)
  }
}

export const getTableNames = async (db: SQLiteDatabase): Promise<string[]> => {
  try {
    const tableNames: string[] = []
    const results = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    )
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        tableNames.push(result.rows.item(index).name)
      }
    })
    return tableNames
  } catch (error) {
    console.error(error)
    throw Error("Failed to get table names from database")
  }
}

export const addUser = async (db: SQLiteDatabase, user: IUser) => {
  const insertQuery = `INSERT INTO Users (id, username, loginid, password, registerbio)
   VALUES (?, ?, ?, ?, ?)`

  const userid = uuid.v4()
  const values = [
    userid,
    user.userName,
    user.loginid,
    user.password,
    user.isRegisterBiometric
  ]
  try {
    db.executeSql(insertQuery, values)
    return userid
  } catch (error) {
    console.error(error)
    throw Error("Failed to add user")
  }
}

export const addTransaction = async (db: SQLiteDatabase, userid: string, transaction: ITransaction[]) => {
  try {
    transaction.forEach(item => {
      const insertQuery = `INSERT INTO Transactions 
      ( 
        to_account_no,
        to_account_name, 
        from_account_no, 
        from_account_name,
        transaction_id,
        recipient_reference, 
        amount, 
        currency,
        timestamp,
        reference_no,
        transaction_status, 
        transaction_type,
        user_id
      )
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`

      const values = [
        item.toAccountNo,
        item.toAccountName,
        item.fromAccountNo,
        item.fromAccountName,
        uuid.v4(),
        item.recipientReference,
        item.amount,
        item.currency,
        item.timestamp,
        item.referenceNo,
        item.transactionStatus,
        item.transactionType,
        userid
      ]
      const insertTransaction = db.executeSql(insertQuery, values)
    })
  } catch (error) {
    console.error(error)
    throw Error("Failed to add transaction")
  }
}

export const addAccount = async (db: SQLiteDatabase, userid: string, account: IAccount[]) => {
  try {
    account.forEach(item => {
      const insertQuery = `INSERT INTO Accounts 
      (
        user_id, 
        account_name, 
        account_no, 
        available_balance, 
        currency, 
        account_type)
       VALUES (?, ?, ?, ?, ?, ?)`

      const values = [
        userid,
        item.accountName,
        item.accountNo,
        item.availableBalance,
        item.accountCurrency,
        item.accountType
      ]
      const insertAccount = db.executeSql(insertQuery, values)
    })
  } catch (error) {
    console.error(error)
    throw Error("Failed to add account")
  }
}

export const getUserTable = async (db: SQLiteDatabase): Promise<IUser[]> => {
  try {
    const users: IUser[] = []
    const results = await db.executeSql("SELECT * FROM Users")
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        users.push(result.rows.item(index))
      }
    })

    console.log("YASUO getUserTable users ", users)
    return users
  } catch (error) {
    console.error(error)
    throw Error("Failed to get Users from database")
  }
}

export const removeTable = async (db: SQLiteDatabase, tableName: string) => {
  const query = `DROP TABLE IF EXISTS ${tableName}`
  try {
    await db.executeSql(query)
  } catch (error) {
    console.error(error)
    throw Error(`Failed to drop table ${tableName}`)
  }
}

export const getLogin = async (
  db: SQLiteDatabase,
  loginid: string,
  password: string,
): Promise<IUserResp> => {
  const query = `SELECT * FROM Users WHERE loginid = ? AND password = ?`
  const values = [loginid, password]

  try {
    const results = await db.executeSql(query, values)

    if (results[0]?.rows?.length) {
      const item = results[0].rows.item(0)
      const userRes = {
        status: true,
        message: 'Login success',
        user: {
          userId: item.id,
          userName: item.username,
          loginid: item.loginid,
          password: item.password,
          isRegisterBiometric: (item.registerbio == 0) ? false : true
        }
      }
      console.log("YASUO getLogin ", userRes)
      return userRes
    } else {
      return { status: false, message: 'Login failed', user: { isRegisterBiometric: false, userId: "" } };
    }
  } catch (error) {
    console.error(error)
    throw Error(`Failed to get ${loginid} from database`)
  }
}

export const getBioAuthLogin = async (
  db: SQLiteDatabase,
  key: string
) => {
  const query = `SELECT * FROM Users WHERE biometrickey = ? AND registerbio = 1`
  const values = [key]

  try {
    const results = await db.executeSql(query, values)

    if (results[0]?.rows?.length) {
      const item = results[0].rows.item(0)
      const userRes = {
        status: true,
        message: 'Login success',
        user: {
          userId: item.id,
          userName: item.username,
          loginid: item.loginid,
          password: item.password,
          isRegisterBiometric: (item.registerbio == 0) ? false : true
        }
      }
      return userRes
    } else {
      return { status: false, message: 'Login failed', user: {} };
    }
  } catch (error) {
    console.error(error)
    throw Error(`Failed to get ${key} from database`)
  }
}

export const updateBioAuthLogin = async (
  db: SQLiteDatabase,
  user: IUser
) => {
  const updateQuery = `UPDATE Users SET registerbio = ?, biometrickey = ?
    WHERE loginid = ? AND password = ?`

  const values = [
    user.isRegisterBiometric,
    user.biometricPublicKey,
    user.loginid,
    user.password
  ]
  
  try {
    const test = db.executeSql(updateQuery, values)
    return test
  } catch (error) {
    console.error(error)
    throw Error("Failed to update biometric login")
  }
}

export const getTransactionHistory = async (db: SQLiteDatabase, userid: string) => {
  try {
    const history: ITransaction[] = []
    const results = await db.executeSql("SELECT * FROM Transactions WHERE user_id = ?", [userid])
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        var item = result.rows.item(index)
        var transaction = {
          toAccountNo: item.to_account_no,
          toAccountName: item.to_account_name,
          fromAccountNo: item.from_account_no,
          fromAccountName: item.from_account_name,
          transactionId: item.transaction_id,
          recipientReference: item.recipient_reference,
          amount: item.amount,
          currency: item.currency,
          timestamp: item.timestamp,
          referenceNo: item.reference_no,
          transactionStatus: item.transaction_status,
          transactionType: item.transaction_type
        }
        history.push(transaction)
      }
    })

    // console.log("YASUO getTransactionHistory history ", history)
    return history
  } catch (error) {
    console.error(error)
    throw Error("Failed to get Transactions from database")
  }
}

export const getAccount = async (db: SQLiteDatabase, userid: string) => {
  try {
    const accountList: IAccount[] = []
    const results = await db.executeSql("SELECT * FROM Accounts WHERE user_id = ?", [userid])
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        var item = result.rows.item(index)
        var account = {
          accountName: item.account_name,
          accountNo: item.account_no,
          availableBalance: item.available_balance,
          accountCurrency: item.currency,
          accountType: item.account_type
        }
        accountList.push(account)
      }
    })
    return accountList
  } catch (error) {
    console.error(error)
    throw Error("Failed to get Accounts from database")
  }
}