import { StyleSheet, Text, BackHandler } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"
import { Colors } from "../../../constants/Colors"

import Spacer from "../../../components/Spacer"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import ThemedCard from "../../../components/ThemedCard"
import ThemedButton from "../../../components/ThemedButton"
import ThemedLoader from "../../../components/ThemedLoader"
import useBooksStore from "../../../stores/useBooksStore"

const BookDetails = () => {
  const { id } = useLocalSearchParams()

  const book = useBooksStore((s) => s.books.find((b) => b.$id === id))
  const fetchBookById = useBooksStore((s) => s.fetchBooksById)
  const deleteBook = useBooksStore((s) => s.deleteBook)

  const router = useRouter()

  const handleDelete = async () => {
    await deleteBook(id)
    router.replace("/books") // ensure navigation returns to Books tab
  }

  // ANDROID HARDWARE BACK OVERRIDE
  useEffect(() => {
    const onBackPress = () => {
      router.replace("/books") // always go to Books tab
      return true // prevent Android from going to Profile tab
    }

    const sub = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    )

    return () => sub.remove()
  }, [])

  // Fetch book if missing
  useEffect(() => {
    if (!book && fetchBookById) {
      fetchBookById(id)
    }
  }, [id])

  if (!book) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ThemedCard styles={styles.card}>
        <ThemedText style={styles.title}>{book.title}</ThemedText>
        <ThemedText>Written by {book.author}</ThemedText>

        <Spacer />

        <ThemedText title={true}>Book description:</ThemedText>
        <Spacer height={10} />

        <ThemedText>{book.description}</ThemedText>
      </ThemedCard>

      <ThemedButton style={styles.delete} onPress={handleDelete}>
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Delete Book
        </Text>
      </ThemedButton>
    </ThemedView>
  )
}

export default BookDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20,
  },
  delete: {
    marginTop: 40,
    backgroundColor: Colors.warning,
    width: 200,
    alignSelf: "center",
  },
})
