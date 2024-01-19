import {Router} from "express";
import discordClient from "@/discord";
import { GuildMember } from "discord.js";

const ApiRouter: Router = Router();

ApiRouter.post("/deleteRole", async (req, res) => {
    let guild = discordClient.guilds.cache.get(req.body.serverId)
    guild.members.fetch({force: true, user: req.body.userId}).then((member: GuildMember) => {
        member.roles.remove(req.body.roleId).then(() => {
            res.status(200).send("")
        })
    })
})

export default ApiRouter;