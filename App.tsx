import React, { useCallback, useEffect } from 'react';
import Routes from './src/routes/index';
import {
  addUser,
  connectToDatabase,
  createTables,
  getTableNames,
  removeTable,
  addTransaction,
  getLogin,
  addAccount
} from './src/services/db';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

import { blue, indigo } from '@mui/material/colors';
import User from './src/mock/User.json'
import Transaction from './src/mock/Transaction.json'
import Account from './src/mock/Account.json'


const App = () => {

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: blue[400],
      onPrimary: indigo[800],
      primaryContainer: blue[50],
      onPrimaryContainer: blue[50]
    }
  };

  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase()
      await removeTable(db, "Users")
      await removeTable(db, "Transactions")
      await removeTable(db, "Accounts")
      await createTables(db)
      await getTableNames(db)
      await addUser(db, User.user_1).then(
        async res => {
          const userid = res.toString()
          await addTransaction(db, userid, Transaction.user_1_transaction)
          await addAccount(db, userid, Account.account_1)
        })
      await addUser(db, User.user_2).then(
        async res => {
          const userid = res.toString()
          await addTransaction(db, userid, Transaction.user_2_transaction)
          await addAccount(db, userid, Account.account_2)
        })
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <PaperProvider theme={theme}>
      <Routes />
    </PaperProvider>
  )
};

export default App;
