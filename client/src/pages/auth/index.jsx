import React, { useState } from 'react'
import Background from "../../assets/login2.png"
import Victory from "../../assets/victory.svg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {apiClient} from "@/lib/api.client.js"

import { LOGIN_ROUTES, SIGNUP_ROUTES } from '@/utils/constants'

const Auth  = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validateLogin =()=>{
    if(!email.length){ // no email length
      toast.error("Email is required")
      return false ;
    }
    if(!password.length){
      toast.error("password is required");
      return false;
    }
    return true;

  }

  const validateSignup = ()=>{
    if(!email.length){ // no email length
      toast.error("Email is required")
      return false ;
    }
    if(!password.length){
      toast.error("password is required");
      return false;
    }
    if(password !== confirmPassword){
      toast.error("passsword and confirm password should be same ");
      return false;
    }
    return true;
  }

  const handleLogin = async ()=>{
    try{
      if(validateLogin()){
        const res  = await apiClient.post(LOGIN_ROUTES,{email,password},{withCredentials:true})
      }
      console.log(res);
    }catch(error){
      console.error('Error during login:', error);
    }
    

  }


  const handleSignup = async ()=>{
    if (validateSignup()) {
      try {
        const res = await apiClient.post(SIGNUP_ROUTES, { email, password }, { withCredentials: true });
        console.log('Signup successful', res);
        // handle the response (e.g., redirect, set user state)
      } catch (error) {
        console.error('Error during signup:', error);
        // Show an error message to the user
        if (error.response) {
          // If the server responded with an error
          console.error('Server error:', error.response.data);
        } else if (error.request) {
          // If no response was received
          console.error('Network error:', error.request);
        } else {
          // General error
          console.error('Error:', error.message);
        }
      }
    }

  }
  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
        <div className='h-[80vh]  bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid  flex items-center justify-center'>
            <div className='flex flex-col gap-10 items-center justify-center'>
                <div className='
                flex items-center justify-center flex-col'>
                  <div className='flex items-center justify-center'>
                  <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                  <img src={Victory} alt='Victory Emoji' className='h-[100px]'/> 
                  </div>
                  <p className='font-medium text-center'>Fill in the details to get started with the best chat app </p>
                </div>
                <div className="flex items-center  justify-center w-full ">
                  <Tabs className='w-3/4'>
                    <TabsList className=' flex rounded-none bg-transparent w-full'>
                      <TabsTrigger className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]: text-black data-[state=active]: font-semibold data-[state=active]: border-b-purple-500 p-3 transition-all duration-300' value='login'>Login</TabsTrigger>
                      <TabsTrigger 
                      className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]: text-black data-[state=active]: font-semibold data-[state=active]: border-b-purple-500 p-3 transition-all duration-300'
                      value='signup'>signup</TabsTrigger>
                    </TabsList>
                    <TabsContent className='flex flex-col gap-5 mt-10 ' value='login'>
                      <Input placeholder="Email" type ="email" className="rounded full p-6" value={email} onChange={(e)=>{
                        setEmail(e.target.value)
                      }} 
                      />
                       <Input placeholder="Password" type ="password" className="rounded full p-6" value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                      }} 
                      />
                      <Button className="rounded-full p-6  " onClick={handleLogin} >Login</Button>
                    </TabsContent>
                    <TabsContent className='flex flex-col gap-5 ' value='signup'>
                    <Input placeholder="Email" type ="email" className="rounded full p-6" value={email} onChange={(e)=>{
                        setEmail(e.target.value)
                      }} 
                      />
                       <Input placeholder="Password" type ="password" className="rounded full p-6" value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                      }} 
                      />
                            <Input placeholder="confirm Password" type ="password" className="rounded full p-6" value={confirmPassword} onChange={(e)=>{
                        setConfirmPassword(e.target.value)
                      }} 
                      />
                      <Button className="rounded-full p-6  " onClick={handleSignup} >Signup</Button>


                    </TabsContent>
                  </Tabs>
                </div>
                
            </div>
            <div className='hidden xl:flex justify-center items-center'>
              <img src={Background} alt='Background login' className='h-[700px]'/>
            </div>
        </div>
    </div>
  )
}

export default Auth