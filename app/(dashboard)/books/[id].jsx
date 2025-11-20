import { StyleSheet, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useBooks } from '../../../hooks/useBooks'
import { Colors } from '../../../constants/Colors'

import Spacer from '../../../components/Spacer'
import ThemedText from '../../../components/ThemedText'
import ThemedView from '../../../components/ThemedView'
import ThemedCard from '../../../components/ThemedCard'
import ThemedButton from '../../../components/ThemedButton'
import Themedloader from '../../../components/ThemedLoader'

const BookDetails = () => {
  const [book, setBook] = useState(null)

  const { id } = useLocalSearchParams()
  const { fetchBooksById, deleteBook } = useBooks()
  const router = useRouter()

  const handleDelete = async () => {
    await deleteBook(id)
    setBook(null)
    router.replace('/books')
  }

  useEffect(() => {
      async function loadBook() {
        const bookData = await fetchBooksById(id)
        setBook(bookData)
      }

      loadBook()
    }, [id])

    if (!book) {
        return (
            <ThemedView safe={true} style={styles.container}>
                <Themedloader />
            </ThemedView>
        )
    }

  return (
    <ThemedView safe={true} style={styles.container}>
        <ThemedCard styles={styles.card}>
            <ThemedText style= {styles.title}>{book.title}</ThemedText>
            <ThemedText>Written by {book.author}</ThemedText>
                <Spacer />

                <ThemedText title={true}>Book description:</ThemedText>
                <Spacer height={10} />

                <ThemedText>{book.description}</ThemedText>
        </ThemedCard>   

        <ThemedButton style={styles.delete} onPress={handleDelete}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>
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
        alignItems: 'stretch',
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
        alignSelf: 'center'
    }
})