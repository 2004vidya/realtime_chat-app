import { apiClient } from "@/lib/api.client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {MdFolderZip} from "react-icons/md"
import {IoMdArrowRoundDown} from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgess,
    setIsDownloading,
  } = useAppStore();

  const [showImage, setshowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error.response || error);
      }
    };

    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return <div className="text-center text-gray-500">No messages yet</div>;
    }

    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const CheckIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif|)$/i;
    return imageRegex.test(filePath);
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {CheckIfImage(message.fileUrl) ? (
            <div className=" cursor-pointer" onClick={()=>{
              setshowImage(true);
              setImageURL(message.fileUrl);
            }}>

              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
              <MdFolderZip/>
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={()=>{downloadFile(message.fileUrl)}}>
                <IoMdArrowRoundDown/>
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const downloadFile = async (url)=>{
    setIsDownloading(true);
    setFileDownloadProgess(0);
    const res= await apiClient.get(`${HOST}/${url}`,{responseType:"blob",
      onDownloadProgress:(ProgressEvent)=>{
        const {loaded,total} = ProgressEvent;
        const percentCompleted = Math.round((loaded*100/total));
        setFileDownloadProgess(percentCompleted)
      }
    })

    const urlBlob = window.URL.createObjectURL(new Blob ([res.data]));
    const link = document.createElement("a");
    link.href =urlBlob;
    link.setAttribute("download",url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgess(0);

  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] sm:w-full">
      {renderMessages()}
      <div ref={scrollRef}>

        {
          showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
            <div>
              <img src={`${HOST}/${imageURL}`}
              className="h-[80vh] w-full bg-cover "
              
              />
              <div className="flex gap-5 mt-5 fixed top-0 ">
                <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={()=>{downloadFile(imageURL)}}
                >
                <IoMdArrowRoundDown/>
                </button>
                <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={()=>{
                  setshowImage(false)
                  setImageURL(null)
                }
              }>
                <IoCloseSharp/>
                </button>

              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default MessageContainer;

// import { apiClient } from "@/lib/api.client";
// import { useAppStore } from "@/store";
// import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
// import moment from "moment";
// import { useEffect, useRef } from "react";
// const MessageContainer = () => {
//   const scrollRef = useRef();
//   const {
//     selectedChatType,
//     selectedChatData,
//     userInfo,
//     selectedChatMessages,
//     setSelectedChatMessages,
//   } = useAppStore();

//   useEffect(() => {
//     const getMessages = async ()=>{
//       try {
//         const res = await apiClient.post(GET_ALL_MESSAGES_ROUTE,{id:selectedChatData._id},{withCredentials:true});
//         if(res.data.messages){
//           setSelectedChatMessages(res.data.messages);
//         }
//       } catch (error) {
//         console.log({error});
//       }
//     };
//     if(selectedChatData._id){
//       if(selectedChatType ==="contact") getMessages();
//     }
//   }, [selectedChatData, selectedChatType,setSelectedChatMessages]);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [selectedChatMessages]);

//   const renderMessages = () => {
//     let lastDate = null;
//     return selectedChatMessages.map((message, index) => {
//       const messageDate = moment(message.timestamp).format("YYYY-MM--DD");
//       const showDate = messageDate !== lastDate;
//       lastDate = messageDate;
//       return (
//         <div key={index}>
//           {showDate && (
//             <div className="text-center text-gray-500 my-2">
//               {moment(message.timestamp).format("LL")}
//             </div>
//           )}
//           {selectedChatType === "contact" && renderDMMessages(message)}
//         </div>
//       );
//     });
//   };

//   const renderDMMessages = (message) => (
//     <div
//       className={`${
//         //if message is sent by current selectdChat id then it should be on left and if sent by us then on right
//         message.sender === selectedChatData._id ? "text-left" : "text-right"
//       }`}
//     >
//       {message.messageType === "text" && (
//         <div
//           className={`${
//             message.sender !== selectedChatData._id
//               ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
//               : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
//           } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
//         >
//           {message.content}
//         </div>
//       )}
//       <div className="text-xs text-gray-600">
//         {moment(message.timestamp).format("LT")}
//       </div>
//     </div>
//   );
//   return (
//     <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] sm:w-full">
//       {renderMessages()}
//       <div ref={scrollRef}></div>
//     </div>
//   );
// };

// export default MessageContainer;
