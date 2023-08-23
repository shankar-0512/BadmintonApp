import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserContext } from "../store/UserContext";
import { fetchUserDetails } from "../store/https";
import { GlobalStyles } from "../constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ProfileScreen() {
  const { userName } = useContext(UserContext);

  const [userData, setUserData] = useState({
    username: "",
    currentRating: 0,
    lastFiveGames: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchUserDetails(userName);
        if (response.responseCode === 0) {
          setUserData(response.userData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Nickname: {userData.username}</Text>
      <View style={styles.ratingContainer}>
        <MaterialCommunityIcons
          name="trophy-award"
          size={24}
          color={GlobalStyles.colors.gray800}
          style={styles.trophyAwardIcon} // Apply the style here
        />
        <Text style={styles.rating}>{userData.currentRating}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: GlobalStyles.colors.primary50,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: GlobalStyles.colors.primary500,
  },
  rating: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: GlobalStyles.colors.primary500,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: GlobalStyles.colors.gray800,
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
    color: GlobalStyles.colors.success500,
    fontSize: 18,
  },
  loss: {
    color: GlobalStyles.colors.error500,
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginLeft: 10,
    position: "relative", // This ensures that children elements with absolute positioning are positioned relative to this container
  },
  trophyAwardIcon: {
    position: "absolute",
    top: 1, // Adjust this value to move the icon upwards
    left: 122, // Adjust this value to move the icon leftwards
  },
});

export default ProfileScreen;
