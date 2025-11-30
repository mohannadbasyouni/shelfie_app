import { useRouter } from "expo-router"
import { useEffect } from "react"
import ThemedLoader from "../ThemedLoader"
import useUserStore from "../../stores/useUserStore"

const UserOnly = ({ children }) => {
  const user = useUserStore((state) => state.user)
  const authChecked = useUserStore((state) => state.authChecked)
  const router = useRouter()

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/login")
    }
  }, [user, authChecked])

  if (!authChecked || !user) {
    return <ThemedLoader />
  }

  return children
}

export default UserOnly
