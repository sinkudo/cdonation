import {Router} from "express";
import discordClient from "@/discord";

const ApiRouter: Router = Router();

ApiRouter.post("/deleteRole", async (req, res) => {
    console.log(req.body);
    let guild = discordClient.guilds.cache.get(req.body.server_id)
    let member = guild?.members.cache.get(req.body.user_id)

    await member.roles.remove(req.body.role_id).then(() => {
        res.status(200).send("")
    })
})

export default ApiRouter;