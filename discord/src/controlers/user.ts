import {serverHTTP} from "@/helper/axios";

export const createUser = async (body) => await serverHTTP.post("/createUser", body);