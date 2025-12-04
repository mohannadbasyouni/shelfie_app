import { create } from "zustand"
import {
  loginService,
  registerService,
  logoutService,
  getUserService,
} from "../services/authService"
import useBooksStore from "./useBooksStore"

const useUserStore = create((set, get) => ({
  user: null,
  authChecked: false,

  login: async (email, password) => {
    try {
      const user = await loginService(email, password)
      set({ user })

      const booksStore = useBooksStore.getState()
      booksStore.fetchBooks(user.$id)
      booksStore.subscribeToBooks(user.$id)

      return user
    } catch (e) {
      throw e
    }
  },

  register: async (email, password) => {
    try {
      const user = await registerService(email, password)
      set({ user })

      const booksStore = useBooksStore.getState()
      booksStore.fetchBooks(user.$id)
      booksStore.subscribeToBooks(user.$id)

      return user
    } catch (e) {
      throw e
    }
  },

  logout: async () => {
    try {
      await logoutService()

      const booksStore = useBooksStore.getState()
      booksStore.resetBooks()

      set({ user: null })
    } catch (e) {
      throw e
    }
  },

  getInitialUserValue: async () => {
    try {
      const user = await getUserService()
      console.log("User from Appwrite:", user)
      set({ user })

      const booksStore = useBooksStore.getState()
      booksStore.fetchBooks(user.$id)
      booksStore.subscribeToBooks(user.$id)
    } catch (e) {
      set({ user: null })
    } finally {
      set({ authChecked: true })
    }
  },
}))

export default useUserStore
