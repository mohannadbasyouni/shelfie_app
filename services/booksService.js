import { databases, client } from "../lib/appwrite"
import { ID, Query, Permission, Role } from "react-native-appwrite"

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID

export async function fetchBooksService(userId) {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
    ])

    return response.documents
  } catch (e) {
    throw e
  }
}

export async function fetchBookByIdService(id) {
  try {
    const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id)

    return response
  } catch (e) {
    throw e
  }
}

export async function createBookService(data, userId) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      { ...data, userId },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    )

    return response
  } catch (e) {
    throw e
  }
}

export async function deleteBookService(id) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id
    )
  } catch (e) {
    throw e
  }
}
