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
import { signup } from "../store/https";

const { colors } = GlobalStyles;

const SUCCESS_RESPONSE = 0;
const ERROR_RESPONSE = 1;

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
      const response = await signup(username, password);

      if (response.responseCode === SUCCESS_RESPONSE) {
        navigation.navigate("LoginScreen");
      } else if (response.responseCode === ERROR_RESPONSE) {
        alert(response.responseMessage);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.gray700}
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

const commonInputStyle = {
  width: "90%",
  padding: 12,
  marginBottom: 20,
  borderRadius: 5,
  fontSize: 16,
};

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
    ...commonInputStyle,
    borderWidth: 1,
    borderColor: colors.primary200,
    backgroundColor: "#fff",
    color: colors.gray800,
  },
  signupButton: {
    backgroundColor: colors.primary500,
    padding: 10,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: colors.gray700,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary400,
    marginLeft: 5,
  },
});

export default SignupScreen;
