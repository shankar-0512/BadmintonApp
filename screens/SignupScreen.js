import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../constants/styles";
import { signup } from "../store/https"; // Assuming you have a signup function in your store

function SignupScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSignup() {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 5) {
      alert("Password should be at least 5 characters long!");
      return;
    }

    try {
      response = await signup(username, password); // Make sure to implement the signup function in your store

      console.log(response);

      if (response.responseCode === 0) {
        navigation.navigate("LoginScreen");
      }

      if (response.responseCode === 1) {
        alert(response.responseMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: GlobalStyles.colors.primary700,
    padding: 10,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
    marginLeft: 5,
  },
});

export default SignupScreen;
