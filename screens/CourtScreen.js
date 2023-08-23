import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../constants/styles";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CourtDataContext } from "../store/CourtDataContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  addToPool,
  removeFromPool,
  fetchActivePlayers,
  getCourtStatus,
} from "../store/https";

function CourtScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const userName = route.params?.userName || "";

  const { activePlayers, courtStatus, setActivePlayers, setCourtStatus } =
    useContext(CourtDataContext);

  const [readyStatus, setReadyStatus] = useState(false);

  async function fetchActivePlayersCount() {
    try {
      response = await fetchActivePlayers(userName);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Court Status</Text>
      <View style={styles.activePlayersContainer}>
        <MaterialCommunityIcons
          name="badminton"
          size={24}
          color={GlobalStyles.colors.gray800}
          style={styles.badmintonIcon} // Apply the style here
        />
        <Text style={styles.activePlayersText}>{activePlayers}</Text>
      </View>

      {Object.values(courtStatus)
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        .map((court, index) => (
          <View key={index} style={styles.court}>
            <Text style={styles.courtText}>{court.name}</Text>
            <Text
              style={[
                styles.statusText,
                court.status ? styles.activeStatus : styles.inactiveStatus,
              ]}
            >
              {court.status ? "Available" : "Unavailable"}
            </Text>
          </View>
        ))}

      <View style={styles.buttonContainer}>
        {!readyStatus && (
          <PrimaryButton onPress={onPressReady}>
            <MaterialCommunityIcons name="badminton" size={24} color="white" />
          </PrimaryButton>
        )}

        {readyStatus && (
          <Text style={styles.waitingText}>
            This may take a few minutes. Please wait
          </Text>
        )}
        {readyStatus && (
          <PrimaryButton onPress={onPressCancel}>
            <MaterialCommunityIcons name="cup-water" size={24} color="white" />
          </PrimaryButton>
        )}
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
    backgroundColor: GlobalStyles.colors.primary50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
    marginBottom: 25,
  },
  activePlayersText: {
    fontSize: 18,
    fontWeight: "500",
    color: GlobalStyles.colors.gray800,
    marginBottom: 20,
  },
  court: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    width: "90%",
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    elevation: 3, // for android
    shadowOffset: { width: 0, height: 2 }, // for ios
    shadowOpacity: 0.25, // for ios
    borderRadius: 8,
  },
  courtText: {
    fontSize: 20,
    fontWeight: "500",
    color: GlobalStyles.colors.gray800,
  },
  statusText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  activeStatus: {
    color: GlobalStyles.colors.success500,
  },
  inactiveStatus: {
    color: GlobalStyles.colors.error500,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  waitingText: {
    fontSize: 16,
    fontWeight: "500",
    color: GlobalStyles.colors.gray700,
    marginBottom: -21.5,
  },
  activePlayersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
    position: "relative", // This ensures that children elements with absolute positioning are positioned relative to this container
  },
  badmintonIcon: {
    position: "absolute",
    top: -0.25, // Adjust this value to move the icon upwards
    left: -30, // Adjust this value to move the icon leftwards
  },
});

export default CourtScreen;
