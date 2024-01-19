import {serverHTTP} from "@/helper/axios";

interface CreateUserRequest {
    id: string,
    address: string
}

export const createUser = async (body: CreateUserRequest) => await serverHTTP.post("/createUser", body);

interface SubRequest {
    serverid: string,
    tierid: number,
    userid: string
}

interface CreateSubResponse {
    serverId: string,
    roleId: string
}

export const createSubscribe = async (body: SubRequest) => await serverHTTP.post<CreateSubResponse>("/createSub", body);

export const removeSubscribe = async (body: SubRequest) => await serverHTTP.post("/cancelSubcription", body);