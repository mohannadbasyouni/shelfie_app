import { create } from "zustand"
import {
  fetchBooksService,
  createBookService,
  deleteBookService,
} from "../services/booksService"
import { client } from "../lib/appwrite"

const useBooksStore = create((set, get) => ({
  books: [],
  subscription: null,

  fetchBooks: async (userId) => {
    try {
      const books = await fetchBooksService(userId)
      set({ books })
      return books
    } catch (e) {
      throw e
    }
  },

  createBook: async (data, userId) => {
    try {
      const newBook = await createBookService(data, userId)
      set({ books: [...get().books, newBook] })
      return newBook
    } catch (e) {
      throw e
    }
  },

  deleteBook: async (id) => {
    try {
      await deleteBookService(id)
      set({ books: get().books.filter((book) => book.$id !== id) })
    } catch (e) {
      throw e
    }
  },

  subscribeToBooks: (userId) => {
    const currentSub = get().subscription
    if (currentSub) currentSub()
    const dbId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
    const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID

    const channel = `databases.${dbId}.collections.${collectionId}.documents`

    const unsubscribe = client.subscribe(channel, (event) => {
      const { payload, events } = event

      if (events[0].includes("create") && payload.userId == userId) {
        set({ books: [...get().books, payload] })
      }

      if (events[0].includes("delete") && payload.userId == userId) {
        set({ books: get().books.filter((book) => book.$id !== payload.$id) })
      }
    })

    set({ subscription: unsubscribe })
  },

  resetBooks: () => {
    const currentSub = get().subscription
    if (currentSub) currentSub()

    set({ books: [], subscription: null })
  },
}))

export default useBooksStore
