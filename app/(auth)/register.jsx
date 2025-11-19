import { Keyboard, StyleSheet, Text } from 'react-native'
import { Link } from 'expo-router'
import { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useUser } from '../../hooks/useUser'
import { Colors } from '../../constants/Colors'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'


const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { register } = useUser()

  const handleSubmit = async () => {
    setError(null)

    try {
      await register(email, password)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ThemedView style={styles.container}>
      
      <Spacer />
      <ThemedText title={true} style={styles.title}>
        Register For an Account
      </ThemedText>

      <ThemedTextInput 
        style={{ width: '80%', marginBottom: 20 }}
        placeholder='Email'
        keyBoardType='email-address'
        onChangeText={setEmail}
        value={email}
      />

      <ThemedTextInput 
        style={{ width: '80%', marginBottom: 20 }}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <ThemedButton onPress={handleSubmit}>
        <Text style={{ color: '#f2f2f2' }}>Register</Text>
      </ThemedButton>

      <Spacer />
      {error && <Text style={styles.error}>{error}</Text>}

      <Spacer height={100} />
        <Link href="/login"> 
            <ThemedText style={{ textAlign: 'center' }}>
                Login instead
            </ThemedText>
        </Link>

    </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Register

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 30,
    },
    error: {
        color: Colors.warning,
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: '#f5c1c8',
        borderWidth: 1,
        borderRadius: 6,
        borderColor: Colors.warning
    }
})