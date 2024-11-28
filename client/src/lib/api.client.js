import axios from "axios";
import {HOSt} from "@utils/constants";

const apiClient = axios.create({
    baseURL:HOST
})
//we will use apiclient inside authcomponents to signup 