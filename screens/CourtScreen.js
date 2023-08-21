import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../constants/styles";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWebSocket } from "../store/WebSocketProvider";

import {
  addToPool,
  removeFromPool,
  fetchActivePlayers,
  getCourtStatus,
} from "../store/https";

function CourtScreen() {
  const socket = useWebSocket();

  const route = useRoute();
  const navigation = useNavigation();

  const userName = route.params?.userName || "";

  const [courtStatus, setCourtStatus] = useState({
    court1: { name: "Court-1", status: true },
    court2: { name: "Court-2", status: true },
    court3: { name: "Court-3", status: true },
    court4: { name: "Court-4", status: true },
  });

  const [readyStatus, setReadyStatus] = useState(false);

  const [activePlayers, setActivePlayers] = useState(0);

  async function fetchActivePlayersCount() {
    try {
      response = await fetchActivePlayers();

      if (response.responseCode === 0) {
        setActivePlayers(response.activePlayersCount);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onPressReady() {
    try {
      response = await addToPool(userName);

      if (response.responseCode === 0) {
        setReadyStatus(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onPressCancel() {
    try {
      response = await removeFromPool(userName);

      if (response.responseCode === 0) {
        setReadyStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCourtStatus() {
    try {
      response = await getCourtStatus();

      if (response.responseCode === 0) {
        setCourtStatus(response.courtStatus);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchActivePlayersCount();
  }, [readyStatus, courtStatus]);

  useEffect(() => {
    // Subscribe to the focus event on the navigation object
    const unsubscribe = navigation.addListener("focus", fetchCourtStatus);

    // Return a cleanup function that will unsubscribe the listener when the component unmounts
    return unsubscribe;
  }, [navigation, fetchCourtStatus]); // Include fetchCourtStatus if it's a dependency

  useEffect(() => {
    // Listen for when CourtScreen receives focus
    const unsubscribe = navigation.addListener("focus", () => {
      setReadyStatus(false);
    });

    // Cleanup: remove the listener when CourtScreen unmounts or loses focus
    return unsubscribe;
  }, [navigation]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      if (receivedData.message.updateType === "active_players") {
        setActivePlayers(receivedData.message.data);
      } else if (receivedData.message.updateType === "court_status") {
        fetchCourtStatus();
      } else if (receivedData.message.updateType === "teams") {
        const { teams, firstAvailableCourt } = receivedData.message.data;

        for (const team of teams) {
          for (const player of [...team.team1, ...team.team2]) {
            if (player.userName === userName) {
              navigation.navigate("GameScreen", {
                teamDetails: teams,
                courtNumber: courtStatus[firstAvailableCourt].name,
                courtKey: firstAvailableCourt,
                userName: userName,
              });
              return;
            }
          }
        }
      }
    };
  }, [socket]);

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
            courtStatus.court1.status
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court1.status ? "Available" : "Unavailable"}
        </Text>
      </View>
      <TouchableOpacity style={styles.court}>
        <Text style={styles.courtText}>Court 2</Text>
        <Text
          style={[
            styles.statusText,
            courtStatus.court2.status
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court2.status ? "Available" : "Unavailable"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.court}>
        <Text style={styles.courtText}>Court 3</Text>
        <Text
          style={[
            styles.statusText,
            courtStatus.court3.status
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court3.status ? "Available" : "Unavailable"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.court}>
        <Text style={styles.courtText}>Court 4</Text>
        <Text
          style={[
            styles.statusText,
            courtStatus.court4.status
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}
        >
          {courtStatus.court4.status ? "Available" : "Unavailable"}
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
