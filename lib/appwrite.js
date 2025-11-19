import { Client, Account, Databases, Avatars } from "react-native-appwrite"
import "react-native-url-polyfill/auto"

export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME)

export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new Databases(client)