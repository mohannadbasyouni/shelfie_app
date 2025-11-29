import { create } from 'zustand'
import { 
    loginService, 
    registerService, 
    logoutService, 
    getUserService 
} from '../services/authService'

const useUserStore = create((set, get) => ({

}))

export default useUserStore