// will have all states regarding chat 
export const createChatSlice = (set,get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],
    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setSelectedChatData:selectedChatData=>set({selectedChatData}),
    setSelectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
    closeChat:()=>set({selectedChatData:undefined,selectedChatType:undefined, selectedChatMessages:[]})
});

//selected chat type will store the selected contact or channel

//selectedChatData will have the actual data of selected chat or channel such as id name email image etc ...

//selectedCHatMessages will have the existing messages of the selected contact