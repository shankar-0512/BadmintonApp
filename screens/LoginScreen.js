import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../store/UserContext";
import { login } from "../store/https";
import { GlobalStyles } from "../constants/styles";
import { ActivityIndicator } from "react-native";

const { colors } = GlobalStyles;

function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserName } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (screen) => () => navigation.navigate(screen);

  async function handleLogin() {
    setIsLoading(true);
    try {
      const response = await login(username, password);

      switch (response.responseCode) {
        case 0:
          await AsyncStorage.setItem("userName", response.userName);
          setUserName(response.userName);
          navigation.replace("CourtOverview", { userName: response.userName });
          break;
        case 1:
        case 3:
        case 4:
        case 5:
        case 2: // Considering that other codes from 1-5 are all error states, we can group them
          alert(response.responseMessage);
          break;
        default:
          alert("Unknown error occurred.");
          break;
      }
    } catch (error) {
      console.log(error);
      alert("Error while logging in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        placeholderTextColor={colors.gray700}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.gray700}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleNavigation("SignupScreen")}>
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
    backgroundColor: colors.primary50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary500,
    marginBottom: 30,
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary200,
    backgroundColor: "#fff",
    color: colors.gray800,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  loginButton: {
    width: "90%",
    padding: 12,
    backgroundColor: colors.primary500,
    alignItems: "center",
    borderRadius: 5,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: colors.gray700,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary400,
    marginLeft: 5,
  },
});

export default LoginScreen;
