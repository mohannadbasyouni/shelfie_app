import { useEffect } from 'react'
import { create } from 'zustand'
import { ID, Permission, Query, Role } from 'react-native-appwrite'

import { databases, client } from '../lib/appwrite'
import { useUser } from './useUser'

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID

const useBooksStoreBase = create((set) => ({
  books: [],
  loading: false,
  error: null,
  fetchBooks: async (userId) => {
    if (!userId) return

    set({ loading: true, error: null })

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId)]
      )

      set({ books: response.documents })
    } catch (error) {
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },
  fetchBooksById: async (id) => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      )

      return response
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },
  createBook: async (data, userId) => {
    if (!userId) return null

    set({ loading: true, error: null })

    try {
      const newBook = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        { ...data, userId },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      )

      return newBook
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },
  deleteBook: async (id) => {
    set({ loading: true, error: null })

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      )

      set((state) => ({ books: state.books.filter((book) => book.$id !== id) }))
    } catch (error) {
      set({ error: error.message })
      throw error
    } finally {
      set({ loading: false })
    }
  },
  subscribeToBooks: (userId) => {
    if (!userId) return undefined

    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`

    return client.subscribe(channel, (response) => {
      const { payload, events } = response
      const belongsToUser = payload?.userId === userId

      if (!belongsToUser) return

      if (events.some((event) => event.includes('create'))) {
        set((state) => ({ books: [...state.books, payload] }))
      }

      if (events.some((event) => event.includes('delete'))) {
        set((state) => ({ books: state.books.filter((book) => book.$id !== payload.$id) }))
      }
    })
  },
  clearBooks: () => set({ books: [] })
}))

export function useBooksStore() {
  const { user } = useUser()

  const books = useBooksStoreBase((state) => state.books)
  const loading = useBooksStoreBase((state) => state.loading)
  const error = useBooksStoreBase((state) => state.error)
  const fetchBooks = useBooksStoreBase((state) => state.fetchBooks)
  const fetchBooksById = useBooksStoreBase((state) => state.fetchBooksById)
  const createBook = useBooksStoreBase((state) => state.createBook)
  const deleteBook = useBooksStoreBase((state) => state.deleteBook)
  const subscribeToBooks = useBooksStoreBase((state) => state.subscribeToBooks)
  const clearBooks = useBooksStoreBase((state) => state.clearBooks)

  useEffect(() => {
    let unsubscribe

    if (user?.$id) {
      fetchBooks(user.$id)
      unsubscribe = subscribeToBooks(user.$id)
    } else {
      clearBooks()
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user?.$id, fetchBooks, subscribeToBooks, clearBooks])

  return {
    books,
    loading,
    error,
    fetchBooks: () => fetchBooks(user?.$id),
    fetchBooksById,
    createBook: (data) => createBook(data, user?.$id),
    deleteBook
  }
}

export default useBooksStore
