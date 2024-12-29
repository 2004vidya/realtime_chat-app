import axios from "axios";
import {HOST} from "@/utils/constants.js";

 export const apiClient = axios.create({
    baseURL:HOST,
    headers: {
        'Content-Type': 'application/json',
      },
     withCredentials:true,
      
})
//we will use apiclient inside authcomponents to signup 