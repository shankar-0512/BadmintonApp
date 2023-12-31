import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserContext } from "../store/UserContext";
import { fetchUserDetails } from "../store/https";
import { GlobalStyles } from "../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

const { colors } = GlobalStyles;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Named constants
const SUCCESS_RESPONSE = 0;

function ProfileScreen() {
  const { userName } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  const [userData, setUserData] = useState({
    username: "",
    currentRating: 0,
    played: 0,
    won: 0,
    lost: 0,
    winPercentage: 0,
    lastFiveGames: [],
  });

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      async function fetchData() {
        try {
          const response = await fetchUserDetails(userName);
          if (response.responseCode === SUCCESS_RESPONSE) {
            setUserData(response.userData);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchData();
    }
  }, [isFocused, userName]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00897B" />
      ) : (
        <>
          <Text style={styles.username}>Nickname: {userData.username}</Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons
              name="trophy-award"
              size={24}
              color={colors.gray800}
              style={styles.trophyAwardIcon}
            />
            <Text style={styles.rating}>{userData.currentRating}</Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeading}>Played</Text>
              <Text style={styles.tableHeading}>Won</Text>
              <Text style={styles.tableHeading}>Lost</Text>
              <Text style={styles.tableHeading}>Win %</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableValue}>{userData.played}</Text>
              <Text style={styles.tableValue}>{userData.won}</Text>
              <Text style={styles.tableValue}>{userData.lost}</Text>
              <Text style={styles.tableValue}>{userData.winPercentage}</Text>
            </View>
          </View>

          <Text style={styles.heading}>Last-5 Form</Text>
          {userData.lastFiveGames
            .slice()
            .reverse()
            .map((change, index) => (
              <View key={index} style={styles.gameCard}>
                <Text style={change > 0 ? styles.win : styles.loss}>
                  {change > 0 ? `W +${change}` : `L ${change}`}
                </Text>
              </View>
            ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.primary50,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: colors.primary500,
  },
  rating: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: colors.primary500,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: colors.gray800,
  },
  gameCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  win: {
    color: colors.success500,
    fontSize: 18,
  },
  loss: {
    color: colors.error500,
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginLeft: 10,
    position: "relative",
  },
  trophyAwardIcon: {
    position: "absolute",
    top: 1,
    left: 122,
  },
  tableContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  tableHeading: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.gray800,
  },
  tableValue: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
    color: colors.primary500,
  },
});

export default ProfileScreen;
