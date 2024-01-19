import {serverHTTP} from "@/helper/axios";

export interface SubTier {
    name: string,
    description: string,
    price: number,
    creatorId: string,
    roleId: string
}

export interface SubTierResponse extends SubTier {
    id: number
}

interface SubTierCreateRequest extends SubTier {
    serverId: string
}

interface SubTierCreateResponse {
    ok: boolean,
    error?: string
}

interface  UpdateSubTierRequest {
    serverId: string,
    tierId: string,
    name: string,
    description: string,
    price: number,
}

export const subTierCreate = async (body: SubTierCreateRequest) => await serverHTTP.post<SubTierCreateResponse>("/createSubtiers", body);

export const getSubTiersByDiscordID = async (discordID: string) => serverHTTP.get<SubTierResponse[]>(`/getDiscordSubtiers/${discordID}`);

export const updateSubTier = async (body: UpdateSubTierRequest) => await serverHTTP.post<SubTierCreateResponse>("/updateTier", body);