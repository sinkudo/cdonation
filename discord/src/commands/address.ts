import {SlashCommandBuilder, ChatInputCommandInteraction} from "discord.js";
import {createUser} from "@/controlers/user";

export const data = new SlashCommandBuilder()
    .setName("address")
    .addChannelOption(option =>
        option.setName('address')
            .setDescription('Адрес')
            .setRequired(true))
    .setDescription("Привязать свой адрес");

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const address = interaction.options.getString("address");
    const userId = interaction.user.id;

    createUser({id: userId, address: address}).then(() => {
        interaction.reply({
            ephemeral: true,
            content: "Адрес успешно привязан"
        })
    })
};