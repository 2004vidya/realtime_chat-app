// will have all states regarding chat
export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts:[],
  isUploading:false,
  isDownloading:false,
  fileUploadProgress:0,
  fileDownloadProgess:0,
  setIsUploading:(isUploading)=>set({isUploading}),
  setIsDownloading:(isDownloading)=>set({isDownloading}),
  setFileUploadProgress:(fileUploadProgress)=>set({fileUploadProgress}),
  setFileDownloadProgess :(fileDownloadProgess)=>set({fileDownloadProgess}),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts:(directMessagesContacts)=>set({directMessagesContacts}),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
           sender:
           selectedChatType === "channel"
           ? message.sender
           : message.sender._id,


        },
      ],
    });
  },
});

//selected chat type will store the selected contact or channel

//selectedChatData will have the actual data of selected chat or channel such as id name email image etc ...

//selectedCHatMessages will have the existing messages of the selected contact
