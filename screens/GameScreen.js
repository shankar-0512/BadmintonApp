import React, { useContext, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  BackHandler,
} from "react-native";
import { GlobalStyles } from "../constants/styles";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useRoute } from "@react-navigation/native";
import { updateElo, navigateToCourtScreen } from "../store/https";
import { UserContext } from "../store/UserContext";
import { CourtDataContext } from "../store/CourtDataContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";

function GameScreen() {
  const route = useRoute();
  const { teamDetails = [], courtNumber = [] } = route.params;
  const { userName } = useContext(UserContext);
  const { updatedDetails, modalVisible, setModalVisible } =
    useContext(CourtDataContext);

  const team1 = teamDetails[0]?.team1 || [];
  const team2 = teamDetails[0]?.team2 || [];

  async function teamHandler(winners, losers) {
    const request = { winner: winners, loser: losers, court: courtNumber };
    try {
      await updateElo(request);
    } catch (error) {
      console.log(error);
    }
  }

  const handleBackButtonPressAndroid = useCallback(
    () => modalVisible,
    [modalVisible]
  );

  useEffect(() => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPressAndroid
    );
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonPressAndroid
      );
    };
  }, [handleBackButtonPressAndroid]);

  const renderPlayer = (player, index) => (
    <Text key={player.userName || index} style={styles.playerText}>
      {player.userName} ({player.elo})
    </Text>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.heading}>Please Head To {courtNumber}</Text>
        <Text style={styles.subHeading}>Good Luck!</Text>

        <View style={styles.gameContainer}>
          <View style={styles.teamCard}>
            <Text style={styles.teamHeading}>Team A</Text>
            {team1.map(renderPlayer)}
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.teamCardB}>
            <Text style={styles.teamHeading}>Team B</Text>
            {team2.map(renderPlayer)}
          </View>
        </View>

        <View style={styles.winnerContainer}>
          <MaterialCommunityIcons
            name="trophy"
            size={24}
            color={GlobalStyles.colors.gray800}
            style={styles.trophyIcon}
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={() => teamHandler(team1, team2)}>
            <Text style={styles.readyButtonText}>Team A</Text>
          </PrimaryButton>
          <PrimaryButton onPress={() => teamHandler(team2, team1)}>
            <Text style={styles.readyButtonText}>Team B</Text>
          </PrimaryButton>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
        >
          <BlurView intensity={200} style={StyleSheet.absoluteFill}>
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
                        {updatedDetails[key].ratingDiff >= 0 ? "+" : ""}
                        {updatedDetails[key].ratingDiff})
                      </Text>
                    </View>
                  ))}
                <PrimaryButton
                  onPress={async () => {
                    await navigateToCourtScreen(userName);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.readyButtonText}>Proceed</Text>
                </PrimaryButton>
              </View>
            </View>
          </BlurView>
        </Modal>
      </View>
    </>
  );
}

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: GlobalStyles.colors.primary500,
  },
  subHeading: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
    color: GlobalStyles.colors.primary500,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginBottom: 20,
  },
  gameContainer: {
    flexDirection: "column",
    width: "90%",
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 45,
  },
  teamCard: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  teamCardB: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  vsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  vsText: {
    fontSize: 32,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
  },
  playerText: {
    fontSize: 20,
    color: GlobalStyles.colors.gray800,
    marginTop: 10,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray500,
    padding: 5,
    borderRadius: 8,
    width: 250,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  teamHeading: {
    fontSize: 22,
    color: GlobalStyles.colors.gray800,
    marginBottom: 10,
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
  winnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
    position: "relative",
  },
  trophyIcon: {
    position: "absolute",
    top: -0.25,
    left: -20,
  },
});
