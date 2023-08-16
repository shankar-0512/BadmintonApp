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
import { login } from "../store/https";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const response = await login(username, password);

      if (response.responseCode === 0) {
        // Save the user name to AsyncStorage
        await AsyncStorage.setItem("userName", response.userName);
        navigation.navigate("CourtOverview", { userName: response.userName });
      }

      if (response.responseCode == 1) {
        alert(response.responseMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
          <Text style={styles.signupLink}>Sign up</Text>
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
  loginButton: {
    backgroundColor: GlobalStyles.colors.primary700,
    padding: 10,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
    marginLeft: 5,
  },
});

export default LoginScreen;
