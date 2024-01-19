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

export const getSubTiersByDiscordID = async (discordID: string) => {
    // return {
    //     data: [{
    //         id: 1,
    //         name: "test",
    //         price: 300,
    //         description: "111111111111111111111111",
    //         userID: "123",
    //         roleID: "321"
    //     }, {
    //         id: 2,
    //         name: "test2",
    //         price: 500,
    //         description: "111111111111111111111111",
    //         userID: "123",
    //         roleID: "321"
    //     }, {
    //         id: 3,
    //         name: "test3",
    //         price: 600,
    //         description: "111111111111111111111111",
    //         userID: "123",
    //         roleID: "321"
    //     }]
    // }
    return await serverHTTP.get<SubTierResponse[]>(`/getDiscordSubtiers/${discordID}`)
}