import discordClient from "@/discord";
import {User} from "discord.js";

export const fetchUser = async (id: number | string): Promise<User> => await discordClient.users.fetch(id);