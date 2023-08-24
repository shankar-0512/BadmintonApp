import React, { useEffect, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { GlobalStyles } from "../constants/styles";
import PrimaryButton from "../components/UI/PrimaryButton";
import {
  addToPool,
  removeFromPool,
  fetchActivePlayers,
  getCourtStatus,
} from "../store/https";
import { CourtDataContext } from "../store/CourtDataContext";

function CourtScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const userName = params?.userName || "";
  const {
    activePlayers,
    courtStatus,
    readyStatus,
    setActivePlayers,
    setCourtStatus,
    setReadyStatus,
  } = useContext(CourtDataContext);

  async function fetchActivePlayersCount() {
    try {
      const response = await fetchActivePlayers(userName);
      if (response.responseCode === 0) {
        setActivePlayers(response.activePlayersCount);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onPressReady() {
    try {
      const response = await addToPool(userName);
      if (response.responseCode === 0) {
        setReadyStatus(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onPressCancel() {
    try {
      const response = await removeFromPool(userName);
      if (response.responseCode === 0) {
        setReadyStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCourtStatus() {
    try {
      const response = await getCourtStatus();
      if (response.responseCode === 0) {
        setCourtStatus(response.courtStatus);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchActivePlayersCount();
  }, [readyStatus]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchCourtStatus);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COURT STATUS</Text>
      <View style={styles.activePlayersContainer}>
        <MaterialCommunityIcons
          name="badminton"
          size={24}
          color={GlobalStyles.colors.gray800}
          style={styles.badmintonIcon}
        />
        <Text style={styles.activePlayersText}>{activePlayers}</Text>
      </View>
      {Object.values(courtStatus)
        .sort((a, b) => a.name.localeCompare(b.name))
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
        {!readyStatus ? (
          <PrimaryButton onPress={onPressReady}>
            <MaterialCommunityIcons name="badminton" size={24} color="white" />
          </PrimaryButton>
        ) : (
          <>
            <Text style={styles.waitingText}>
              This may take a few minutes. Please wait
            </Text>
            <PrimaryButton onPress={onPressCancel}>
              <MaterialCommunityIcons name="cup-water" size={24} color="white" />
            </PrimaryButton>
          </>
        )}
      </View>
    </View>
  );
}

const { colors } = GlobalStyles;

const commonTextStyles = {
  fontWeight: "500",
  color: colors.gray800,
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
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary500,
    marginBottom: 25,
  },
  activePlayersText: {
    fontSize: 18,
    marginBottom: 20,
    ...commonTextStyles,
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
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    borderRadius: 8,
  },
  courtText: {
    fontSize: 20,
    ...commonTextStyles,
  },
  statusText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  activeStatus: {
    color: colors.success500,
  },
  inactiveStatus: {
    color: colors.error500,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  waitingText: {
    fontSize: 16,
    color: colors.gray700,
    marginBottom: -21.5,
    ...commonTextStyles,
  },
  activePlayersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
    position: "relative",
  },
  badmintonIcon: {
    position: "absolute",
    top: -0.25,
    left: -30,
  },
});

export default CourtScreen;
