import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { useEffect, useRef, createContext, useContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null); // To hold the socket instance
    const { userInfo } = useAppStore();
    const [socketValue, setSocketValue] = useState(null); // Reactive value for the context

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            // Update the reactive state
            setSocketValue(socket.current);

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
            });

            // Cleanup function
            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
                setSocketValue(null); // Reset the context value on cleanup
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socketValue}>
            {children}
        </SocketContext.Provider>
    );
};
