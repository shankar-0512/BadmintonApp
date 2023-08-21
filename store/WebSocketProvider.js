import { createContext, useContext, useState, useEffect } from "react";

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = new WebSocket("ws://10.126.197.37:8000/ws/updates/");
    setSocket(s);
    
    return () => {
      s.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}
