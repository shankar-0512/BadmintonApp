import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../constants/styles";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { addToPool } from "../store/https";

function CourtScreen() {
  const navigation = useNavigation();

  const [courtStatus] = useState({
    court1: true,
    court2: false,
    court3: true,
    court4: false,
  });

  const [readyStatus, setReadyStatus] = useState(false);

  async function onPressReady() {
    setReadyStatus(true);

    try {
      response = await addToPool();
    } catch (error) {
      console.log(error);
    }
  }

  function onPressCancel() {
    setReadyStatus(false);
  }

  // Default active players, can be fetched from the backend later
  const activePlayers = 27;

  return (
    <View style={styles.container}>
      <Text style={styles.activePlayersText}>
        Active Players: {activePlayers}
      </Text>
      <View style={styles.court}>
        <Text style={styles.courtText}>Court 1</Text>
        <Text
          style={[
            styles.statusText,
            courtStatus.court1 ? styles.activeStatus : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court1 ? "Available" : "Unavailable"}
        </Text>
      </View>
      <TouchableOpacity style={styles.court}>
        <Text style={styles.courtText}>Court 2</Text>
        <Text
          style={[
            styles.statusText,
            courtStatus.court2 ? styles.activeStatus : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court2 ? "Available" : "Unavailable"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.court}>
        <Text style={styles.courtText}>Court 3</Text>
        <Text
          style={[
            styles.statusText,
            courtStatus.court3 ? styles.activeStatus : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court3 ? "Available" : "Unavailable"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.court}>
        <Text style={styles.courtText}>Court 4</Text>
        <Text
          style={[
            styles.statusText,
            courtStatus.court4 ? styles.activeStatus : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court4 ? "Available" : "Unavailable"}
        </Text>
      </TouchableOpacity>
      {!readyStatus && (
        <PrimaryButton onPress={onPressReady}>
          <Text style={styles.readyButtonText}>Ready</Text>
        </PrimaryButton>
      )}
      {readyStatus && (
        <Text style={styles.waitingText}>
          This may take a few minutes. Please wait
        </Text>
      )}
      {readyStatus && (
        <PrimaryButton onPress={onPressCancel}>
          <Text style={styles.readyButtonText}>Cancel</Text>
        </PrimaryButton>
      )}
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
  activePlayersText: {
    fontSize: 16,
    marginBottom: 10,
  },
  waitingText: {
    fontSize: 16,
    marginTop: 22,
    marginBottom: -15,
    fontWeight: "500",
  },
  court: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: "90%",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: GlobalStyles.colors.primary700,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  courtText: {
    fontSize: 18,
    color: "#ffffff",
  },
  statusText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  activeStatus: {
    color: "#00ff00",
  },
  inactiveStatus: {
    color: "red",
  },
  readyButtonText: {
    fontSize: 18,
    color: "white",
  },
});

export default CourtScreen;
