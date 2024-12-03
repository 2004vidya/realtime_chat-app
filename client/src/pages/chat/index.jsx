import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';



const Chat = () => {
  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!userInfo.profileSetup){
      //if the profilesetup is not completed the user cannot go to chat page he has to complete profilesetup first
      toast("please setup profile to continue");
      navigate("/profile");
    }
    
  
    
  }, [userInfo,navigate])
  
  return (
    <div>Chat</div>
  )
};

export default Chat