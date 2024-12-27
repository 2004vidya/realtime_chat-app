import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { useEffect, useRef, createContext, useContext, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null); // To hold the socket instance
    const { userInfo, selectedChatData, selectedChatType, addMessage } = useAppStore();
    const [socketValue, setSocketValue] = useState(null); // Reactive value for the context

    // Function to handle receiving messages
    const handleReceiveMessage = useCallback(
        (message) => {
            if (
                selectedChatType !== undefined &&
                (selectedChatData?._id === message.sender._id || selectedChatData?._id === message.recipient._id)
            ) {
                console.log("Message received:", message);
                addMessage(message);
            }
        },
        [selectedChatData, selectedChatType, addMessage]
    );

    useEffect(() => {
        if (userInfo) {
            // Initialize the socket connection
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            // Update the reactive state for context
            setSocketValue(socket.current);

            // Handle socket connection
            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            // Handle receiving messages
            socket.current.on("receiveMessage", handleReceiveMessage);

            // Cleanup function
            return () => {
                if (socket.current) {
                    socket.current.off("receiveMessage", handleReceiveMessage);
                    socket.current.disconnect();
                }
                setSocketValue(null); // Reset the context value
            };
        }
    }, [userInfo, handleReceiveMessage]);

    return <SocketContext.Provider value={socketValue}>{children}</SocketContext.Provider>;
};
