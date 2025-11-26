import { useEffect } from 'react'
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'
import { ID, Permission, Query, Role } from 'react-native-appwrite'

import { databases, client } from '../lib/appwrite'
import { useUser } from './useUser'

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID

const useBooksStoreBase = create((set, get) => ({
  books: [],
  loading: false,
  error: null,
  initializedForUser: null,
  unsubscribe: null,
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
  ensureBooksSync: async (userId) => {
    const { initializedForUser, unsubscribe } = get()

    if (!userId) {
      if (unsubscribe) {
        unsubscribe()
      }

      set({ books: [], initializedForUser: null, unsubscribe: null })
      return
    }

    if (initializedForUser === userId) return

    if (unsubscribe) {
      unsubscribe()
    }

    set({ initializedForUser: userId, unsubscribe: null })
    const nextUnsubscribe = get().subscribeToBooks(userId)
    set({ unsubscribe: nextUnsubscribe })
    await get().fetchBooks(userId)
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
    const handleResponse = (response) => {
      const { payload, events } = response
      const belongsToUser = payload?.userId === userId

      if (!belongsToUser) return

      if (events.some((event) => event.includes('create'))) {
        set((state) => ({ books: [...state.books, payload] }))
      } else if (events.some((event) => event.includes('update'))) {
        set((state) => ({
          books: state.books.map((book) => (book.$id === payload.$id ? payload : book))
        }))
      } else if (events.some((event) => event.includes('delete'))) {
        set((state) => ({ books: state.books.filter((book) => book.$id !== payload.$id) }))
      }
    }

    // Appwrite Realtime enforces document-level permissions, so only documents readable
    // by the current user will be delivered even though the channel is collection-wide.
    return client.subscribe(channel, handleResponse)
  },
  clearBooks: () => set({ books: [] })
}))

export function useBooksStore() {
  const { user } = useUser()

  const {
    books,
    loading,
    error,
    fetchBooks,
    fetchBooksById,
    createBook,
    deleteBook,
    ensureBooksSync
  } = useBooksStoreBase(
    (state) => ({
      books: state.books,
      loading: state.loading,
      error: state.error,
      fetchBooks: state.fetchBooks,
      fetchBooksById: state.fetchBooksById,
      createBook: state.createBook,
      deleteBook: state.deleteBook,
      ensureBooksSync: state.ensureBooksSync
    }),
    shallow
  )

  useEffect(() => {
    ensureBooksSync(user?.$id)
  }, [user?.$id, ensureBooksSync])

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
