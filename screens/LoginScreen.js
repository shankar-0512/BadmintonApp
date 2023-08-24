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

const { colors } = GlobalStyles;

function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserName } = useContext(UserContext);

  const handleNavigation = (screen) => () => navigation.navigate(screen);
  
  async function handleLogin() {
    try {
      const response = await login(username, password);

      if (response.responseCode === 0) {
        await AsyncStorage.setItem("userName", response.userName);
        setUserName(response.userName);
        navigation.navigate("CourtOverview", { userName: response.userName });
      } else if (response.responseCode === 1) {
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
        <Text style={styles.loginButtonText}>Login</Text>
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
