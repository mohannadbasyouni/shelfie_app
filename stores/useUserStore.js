import { create } from "zustand"
import {
  loginService,
  registerService,
  logoutService,
  getUserService,
} from "../services/authService"

const useUserStore = create((set, get) => ({
  user: null,
  authChecked: false,

  login: async (email, password) => {
    try {
      const user = await loginService(email, password)
      set({ user })
      return user
    } catch (e) {
      throw e
    }
  },

  register: async (email, password) => {
    try {
      const user = await registerService(email, password)
      set({ user })
      return user
    } catch (e) {
      throw e
    }
  },

  logout: async () => {
    try {
      await logoutService()
      set({ user: null })
    } catch (e) {
      throw e
    }
  },

  getInitialUserValue: async () => {
    try {
      const user = await getUserService()
      set({ user })
    } catch (e) {
      set({ user: null })
    } finally {
      set({ authChecked: true })
    }
  },
}))

export default useUserStore
