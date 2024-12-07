import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api.client";
import { ADD_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  
  useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
  }, [userInfo])
  

  //inside validate prfile we will do checks of firstname and lastname and if they are missing we will return an error 
  const validateProfile =()=>{
    if(!firstName){
      toast.error("First Name is required");
      return false;
    }
    if(!lastName){
      toast.error("lastName is required");
      return false;
    }
    return true;

  }
  const saveChanges = async () => {
    if(validateProfile()){
      try { //calling the API
        const res =await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:setSelectedColor},{withCredentials:true});
        //make sure to use withcredentials:true or else you wont be sending cookies to backend and you wont get userId and you wont be able to update your data
        if(res.status===200 && res.data){
          setUserInfo({...res.data});
          toast.success("Profile Updated successfully");
          navigate("/chat")
        }
        
      } catch (error) {
        console.log(error);
        
        
      }
    }
  };

  const handleNavigate =()=>{
    if(userInfo.profileSetup){
      navigate("/chat");
    }
    else{
      toast.error("Please Setup Profile")
    }
  }

  const handleFileInputClick = ()=>{
    fileInputRef.current.click();
  };

  const handleImageChange = async (event)=>{
    const file = event.target.files[0];
    console.log({file});
    if(file){
      const formData = new FormData();
      formData.append("profile-image",file);
      const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
      if (res.status===200 && res.data.image){
        setUserInfo({...userInfo,image:res.data.image});
        toast.success("Image updated successfully");
      }
      
    }
    

  }

  const handleDeleteImage = async()=>{}

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white text-opacity-90 " />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 m:w-48 md:h-48 relative flex items-center  justify-center"
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  classNameobject-cover
                  w-full
                  h-full
                  bg-black
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )} `}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute flex items-center justify-center rounded-full inset-0 bg-black/50 ring-fuchsia-50 cursor-pointer" onClick={image? handleDeleteImage:handleFileInputClick}>
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg,   .webp" />
          </div>
          <div className="flex min-w-32 md:min-2-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full ">
              <Input
                placeholder="email "
                disabled
                type="email "
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full ">
              <Input
                placeholder="firstName "
                onChange={(e)=>{setFirstName(e.target.value)}}
                
                type="text"
                value={userInfo.firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full ">
              <Input
                placeholder="lastname "
                onChange={(e)=>{setLastName(e.target.value)}}
                
                type="text "
                value={userInfo.lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {
                colors.map((color,index)=><div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor===index? "outline outline-white/90 outline-3":""}`} key={index}
                onClick={()=>{setSelectedColor(index)}}
                >

                </div>)
              }
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button onClick={saveChanges} className=" h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration 300ms">
            Save Changes
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Profile;
