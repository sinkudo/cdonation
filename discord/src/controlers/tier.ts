import {serverHTTP} from "@/helper/axios";

export interface SubTier {
    name: string,
    description: string,
    price: number,
    creatorid: string,
    roleid: string
}

export interface SubTierResponse extends SubTier {
    id: number
}

interface SubTierCreateRequest extends SubTier {
    serverid: string
}

interface SubTierCreateResponse {
    ok: boolean,
    error?: string
}

export const subTierCreate = async (body: SubTierCreateRequest) => await serverHTTP.post<SubTierCreateResponse>("/createSubtiers", body);

export const getSubTiersByDiscordID = async (discordID: string) => serverHTTP.get<SubTierResponse[]>(`/getDiscordSubtiers/${discordID}`);

export const updateSubTier = async (body) => await serverHTTP.post("/updateSubtiers", body);