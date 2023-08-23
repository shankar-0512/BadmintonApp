import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import { GlobalStyles } from "../constants/styles";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useRoute, useNavigation } from "@react-navigation/native";
import { updateElo, navigateToCourtScreen } from "../store/https";
import { UserContext } from "../store/UserContext";
import { CourtDataContext } from "../store/CourtDataContext";

function GameScreen() {

  const navigation = useNavigation();
  const route = useRoute();
  const teams = route.params?.teamDetails || [];
  const courtNumber = route.params?.courtNumber || [];
  const courtKey = route.params?.courtKey;

  const { userName } = useContext(UserContext);

  // State for handling the modal
  //const [modalVisible, setModalVisible] = useState(false);
  //const [updatedDetails, setUpdatedDetails] = useState({});

  const { updatedDetails, modalVisible } = useContext(CourtDataContext);

  const player1Name = teams[0].team1[0].userName;
  const player2Name = teams[0].team1[1].userName;
  const player3Name = teams[0].team2[0].userName;
  const player4Name = teams[0].team2[1].userName;

  const player1Elo = teams[0].team1[0].elo;
  const player2Elo = teams[0].team1[1].elo;
  const player3Elo = teams[0].team2[0].elo;
  const player4Elo = teams[0].team2[1].elo;

  async function teamHandler(winners, losers) {
    const request = {
      winner: winners,
      loser: losers,
      court: courtNumber,
    };

    try {
      await updateElo(request);
    } catch (error) {
      console.log(error);
    }
  }

  function teamAHandler() {
    teamHandler(teams[0].team1, teams[0].team2);
  }

  function teamBHandler() {
    teamHandler(teams[0].team2, teams[0].team1);
  }

  async function proceedHandler() {
    await navigateToCourtScreen(userName);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.matchingPlayersText}>
        Please Head To {courtNumber}
      </Text>
      <Text style={styles.matchingPlayersText}>Good Luck!</Text>

      <View style={styles.gameContainer}>
        <View style={styles.teamContainer}>
          <View style={styles.teamColumn}>
            <Text style={styles.teamHeading}>Team A</Text>
            <Text style={styles.playerText}>
              {player1Name} ({player1Elo})
            </Text>
            <Text style={styles.playerText}>
              {player2Name} ({player2Elo})
            </Text>
          </View>
        </View>
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>Vs</Text>
        </View>
        <View style={styles.teamContainer}>
          <View style={styles.teamColumn}>
            <Text style={styles.teamHeading}>Team B</Text>
            <Text style={styles.playerText}>
              {player3Name} ({player3Elo})
            </Text>
            <Text style={styles.playerText}>
              {player4Name} ({player4Elo})
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.matchingPlayersText}>Winner</Text>
      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={teamAHandler}>
          <Text style={styles.readyButtonText}>Team A</Text>
        </PrimaryButton>
        <PrimaryButton onPress={teamBHandler}>
          <Text style={styles.readyButtonText}>Team B</Text>
        </PrimaryButton>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {Object.keys(updatedDetails)
              .filter((key) => key === userName)
              .map((key, index) => (
                <View key={index}>
                  <Text style={styles.modalHeading}>
                    {updatedDetails[key].result === 1
                      ? "Congratulations!"
                      : "Better luck next time!"}
                  </Text>
                  <Text style={styles.modalText}>
                    {"New Rating"}: {updatedDetails[key].eloRating} (
                    {updatedDetails[key].ratingDiff > 0 ? "+" : ""}
                    {updatedDetails[key].ratingDiff})
                  </Text>
                </View>
              ))}
            <PrimaryButton onPress={proceedHandler}>
              <Text style={styles.readyButtonText}>Proceed</Text>
            </PrimaryButton>
          </View>
        </View>
      </Modal>
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
  buttonContainer: {
    flexDirection: "row", // Arrange the buttons horizontally
    justifyContent: "space-evenly", // Add space between the buttons
    width: "90%", // Make the container take the full width
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
  teamHeading: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
  },
  readyButtonText: {
    fontSize: 18,
    color: "white",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
});
