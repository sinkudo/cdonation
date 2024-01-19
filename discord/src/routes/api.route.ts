import {Router} from "express";
import discordClient from "@/discord";
import { GuildMember } from "discord.js";

const ApiRouter: Router = Router();

ApiRouter.post("/deleteRole", async (req, res) => {
    console.log(req.body);
    let guild = discordClient.guilds.cache.get(req.body.server_id)
    let member = <GuildMember>guild?.members.cache.get(req.body.user_id)
    // console.log(member)
    console.log(guild)
    await member.roles.remove(req.body.role_id).then(() => {
        res.status(200).send("")
    })
})

export default ApiRouter;