import {serverHTTP} from "@/helper/axios";

interface CreateUserRequest {
    id: string,
    address: string
}

export const createUser = async (body: CreateUserRequest) => await serverHTTP.post("/createUser", body);