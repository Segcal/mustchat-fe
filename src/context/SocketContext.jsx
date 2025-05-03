import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client"; // Import io from socket.io-client
import { useAppStore } from "@/stores";
import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext); // Fixed from userContext to useContext
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id }, // Changed from userInfo to userId
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server...");
      });

      const handleRecieveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          ( selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
            console.log("Recieved message", message);
            addMessage(message);
        }
      };

      const handleRecieveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
            console.log("Recieved channel message", message);
            addMessage(message);
        }
      }

      socket.current.on("receiveMessage", handleRecieveMessage);
      socket.current.on("receive-channel-message", handleRecieveChannelMessage);

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
