"use strict";

import {BaseInteraction} from "discord.js";
import {getSubTiers, subEdit} from "@/commands/info";

const {Client, GatewayIntentBits, Events, Collection} = require("discord.js");
const path = require("path");
const fs = require("fs");

const discordClient = new Client({intents: [GatewayIntentBits.Guilds]});

discordClient.commands = new Collection();
discordClient.once(Events.ClientReady, async () => {
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file: string) => file.endsWith(".ts"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await require(filePath);

        discordClient.commands.set(command.data.name, command);
        await discordClient.application.commands.create(command.data);
    }
});

const buttonInteractions = {
    "sub": getSubTiers,
    "subedit": subEdit
}

type buttonKey = keyof typeof buttonInteractions;

discordClient.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    if (interaction.isChatInputCommand()) {
        const command = discordClient.commands.get(interaction.commandName);

        if (!command) {
            console.error(`[Discord] No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!", ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!", ephemeral: true
                });
            }
        }
    } else if (interaction.isContextMenuCommand()) {
        const contextCommand = discordClient.commands.get(interaction.commandName);

        if (!contextCommand) {
            console.error(`[Discord] No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await contextCommand.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!", ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!", ephemeral: true
                });
            }
        }
    } else if (interaction.isStringSelectMenu()) {

    } else if (interaction.isModalSubmit()) {

    } else if (interaction.isButton()) {
        let id = interaction.customId.split("#")
        await buttonInteractions[id[0] as buttonKey](interaction);
    }
});

discordClient.connect = () => {
    discordClient.login(process.env.BOT_TOKEN).then(() => console.log("[Discord] Logged in as " + discordClient.user.tag));
};

export default discordClient;