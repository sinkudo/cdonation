import {
    Locale,
    ApplicationCommandType,
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle, ActionRowBuilder, MessageActionRowComponentBuilder, ButtonInteraction, PermissionsBitField, GuildMember
} from "discord.js";
import {getSubTiersByDiscordID, SubTierResponse} from "@/controlers/tier";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Написать приветственное сообщение");

export const execute = async (interaction: ChatInputCommandInteraction) => {
    let header = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('Добро пожаловать в наш дискорд канал!')
        .setDescription("Здравствуйте, уважаемые подписчики и ценители нашего творчества!\n" +
            "Ваши донаты являются важным стимулом для развития и создания еще более интересного и качественного контента. Оставайтесь с нами, участвуйте в обсуждениях, предлагайте свои идеи, и вы сможете стать частью нашей дружной семьи. Спасибо, что вы с нами!!\n");

    let buttonPay = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Задонатить")
        .setCustomId("pay")

    let buttonSub = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel("Подписки")
        .setCustomId("sub");

    let actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttonPay, buttonSub);

    await interaction.channel?.send({
        embeds: [header],
        components: [actionRow]
    });

    await interaction.deferReply({ephemeral: true});
};

export const getSubTiers = async (interaction: ButtonInteraction) => {
    const guild = interaction.guild!;
    const user = <GuildMember>interaction.member;
    const isAdmin = user.permissions.has(PermissionsBitField.Flags.Administrator);

    getSubTiersByDiscordID(String(guild.id)).then(async tiers => {

        const createOptions = (tier: SubTierResponse) => {
            let buttonSub = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel("Оформить подписку")
                .setCustomId(`subcribe#${tier.id}`);

            let buttonEdit = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Изменить")
                .setCustomId(`subedit#${tier.id}#${tier.name}#${tier.price}`);

            let actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();
            if (isAdmin) actionRow.addComponents(buttonEdit);
            else actionRow.addComponents(buttonSub);

            return {
                ephemeral: true,
                embeds: [new EmbedBuilder()
                    .setColor(0x2B2D31)
                    .setTitle(`${tier.name} - ${tier.price}`)
                    .setDescription(`${tier.description}`)],
                components: [actionRow]
            }
        }

        if (tiers.data.length > 0)
            await interaction.reply(createOptions(tiers.data[0]))

        for (let i = 1; i < tiers.data.length; i++)
            await interaction.followUp(createOptions(tiers.data[i]))

    }).catch()
    {
    }
}