import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { GlobalStyles } from "../constants/styles";

function GameScreen() {
  return (
    <View style={styles.container}>
      {!readyStatus && <Text style={styles.matchingPlayersText}>Welcome</Text>}
      {readyStatus && (
        <Text style={styles.matchingPlayersText}>Waiting for others</Text>
      )}
      <View style={styles.gameContainer}>
        <View style={styles.teamContainer}>
          <View style={styles.teamColumn}>
            <Text style={styles.playerText}>Player 1</Text>
            <Text style={styles.playerText}>Player 2</Text>
          </View>
        </View>
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>Vs</Text>
        </View>
        <View style={styles.teamContainer}>
          <View style={styles.teamColumn}>
            <Text style={styles.playerText}>Player 3</Text>
            <Text style={styles.playerText}>Player 4</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  matchingPlayersText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: GlobalStyles.colors.primary800,
  },
  gameContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "50%",
    width: "90%",
    marginBottom: 40,
    borderRadius: 20,
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
  teamContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  teamColumn: {
    flex: 1,
    alignItems: "center",
  },
  vsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  vsText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  playerText: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
  },
  readyButtonText: {
    fontSize: 18,
    color: "white",
  },
});
