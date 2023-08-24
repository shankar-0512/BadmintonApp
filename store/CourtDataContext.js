import { createContext, useState } from "react";

export const CourtDataContext = createContext();

export function CourtDataContextProvider({ children }) {
  const [activePlayers, setActivePlayers] = useState(0);
  const [courtStatus, setCourtStatus] = useState({
    court1: { name: "Court-1", status: true },
    court2: { name: "Court-2", status: true },
    court3: { name: "Court-3", status: true },
    court4: { name: "Court-4", status: true },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [readyStatus, setReadyStatus] = useState(false);

  const value = {
    activePlayers,
    courtStatus,
    setActivePlayers,
    setCourtStatus,
    modalVisible,
    setModalVisible,
    updatedDetails,
    setUpdatedDetails,
    readyStatus,
    setReadyStatus,
  };

  return (
    <CourtDataContext.Provider value={value}>
      {children}
    </CourtDataContext.Provider>
  );
}
