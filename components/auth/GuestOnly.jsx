import { useRouter } from "expo-router"
import { useEffect } from "react"
import ThemedLoader from "../ThemedLoader"
import useUserStore from "../../stores/useUserStore"

const GuestOnly = ({ children }) => {

    const user = useUserStore((state) => state.user)
    const authChecked = useUserStore((state) => state.authChecked)
    const router = useRouter()

    console.log("GuestOnly => user:", user, "authChecked:", authChecked)

    useEffect(() => {
        if (authChecked && user !== null) {
            router.replace('/profile')
        }
    }, [user, authChecked])

    if (!authChecked || user) {
        return <ThemedLoader />
    }

    return children
}

export default GuestOnly
