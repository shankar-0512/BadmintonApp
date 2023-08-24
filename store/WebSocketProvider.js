import { useContext, useState, useEffect, createContext, useRef } from "react";
import { CourtDataContext } from "./CourtDataContext";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./UserContext";

export const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const {
    courtStatus,
    setActivePlayers,
    setCourtStatus,
    setModalVisible,
    setUpdatedDetails,
    setReadyStatus,
  } = useContext(CourtDataContext);
  const navigation = useNavigation();
  const { userName } = useContext(UserContext);

  const userNameRef = useRef(userName);

  useEffect(() => {
    userNameRef.current = userName; // Always keep the ref updated with the latest value
  }, [userName]);

  useEffect(() => {
    const s = new WebSocket(
      "wss://badminton-app-py-c9deadd73cd5.herokuapp.com/ws/updates/"
    );

    s.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      switch (receivedData.message.updateType) {
        case "active_players":
          setActivePlayers(receivedData.message.data);
          break;
        case "court_status":
          setCourtStatus(receivedData.message.data);
          break;
        case "teams": // Handle the teams update
          const { teams, firstAvailableCourt } = receivedData.message.data;

          for (const team of teams) {
            for (const player of [...team.team1, ...team.team2]) {
              if (player.userName === userNameRef.current) {
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
          break;
        case "navigateBack": // Handle the teams update
          if (userNameRef.current === receivedData.message.data) {
            setReadyStatus(false);
            navigation.navigate("CourtScreen");
          }
          break;

        case "updatedDetailsModal": // Handle the teams update
          setUpdatedDetails(receivedData.message.data);
          setModalVisible(true);
          break;
        default:
          break;
      }
    };

    setSocket(s);

    return () => {
      s.close();
    };
  }, [setActivePlayers, setCourtStatus, navigation]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}
