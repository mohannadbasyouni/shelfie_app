import { account } from '../lib/appwrite'
import { ID } from 'react-native-appwrite'

export function logoutService() {
  return account.deleteSession('current')
}

export function getUserService() {
    return account.get()
}

export async function loginService(email, password) {
    await account.createEmailPasswordSession(email, password)
    return account.get()
}

export async function registerService(email, password) {
    await account.create(ID.unique(), email, password)
    await account.createEmailPasswordSession(email, password)
    return account.get()
}
