import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    MessageActionRowComponentBuilder,
    ButtonInteraction,
    PermissionsBitField,
    GuildMember, ButtonStyle, ChannelType, PermissionFlagsBits
} from "discord.js";
import {getSubTiersByDiscordID, SubTierResponse, updateSubTier} from "@/controlers/tier";
import {subTierCreateModal} from "@/components/modals/subTierCreateModal";
import {createSubscribe, removeSubscribe} from "@/controlers/user";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Написать приветственное сообщение");

export const execute = async (interaction: ChatInputCommandInteraction) => {
    let header = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle('Добро пожаловать в наш дискорд канал!')
        .setDescription("Здравствуйте, уважаемые подписчики и ценители нашего творчества!\n" +
            "Ваши донаты являются важным стимулом для развития и создания еще более интересного и качественного контента. Оставайтесь с нами, участвуйте в обсуждениях, предлагайте свои идеи, и вы сможете стать частью нашей дружной семьи. Спасибо, что вы с нами!!\n");

    // let buttonPay = new ButtonBuilder()
    //     .setStyle(ButtonStyle.Primary)
    //     .setLabel("Задонатить")
    //     .setCustomId("pay")

    let buttonSub = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel("Подписки")
        .setCustomId("sub");

    let actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttonSub);

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
            let buttonSub = new ButtonBuilder();
            // console.log(user.roles.cache)
            // console.log(tier)
            if (user.roles.cache.get(tier.roleId)) {
                buttonSub
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Отменить подписку")
                    .setCustomId(`desubcribe#${tier.id}#${tier.roleId}`);
            } else {
                buttonSub
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Оформить подписку")
                    .setCustomId(`subcribe#${tier.id}`);
            }

            let buttonEdit = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Изменить")
                .setCustomId(`subedit#${tier.id}#${tier.name}#${tier.price}#${tier.description}`);

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

export const subEdit = async (interaction: ButtonInteraction) => {
    const [bname, id, name1, price1, description1] = interaction.customId.split("#")
    await interaction.showModal(subTierCreateModal(name1, price1, description1))

    const submitted = await interaction.awaitModalSubmit({
        time: 600000,
        filter: i => i.user.id === interaction.user.id
    }).catch(() => null);

    if (submitted) {
        try {
            const name = submitted.fields.getTextInputValue("modal-addTier-name");
            const price = Number(submitted.fields.getTextInputValue("modal-addTier-price"));
            if (isNaN(price)) throw new Error("Неккоректная цена");
            const description = submitted.fields.getTextInputValue("modal-addTier-description");

            const guild = interaction.guild!;

            updateSubTier({
                serverId: String(guild.id),
                tierId: id,
                name: name,
                price: price,
                description: description
            }).then(async (response) => {
                if (response.data.ok) {
                    await submitted.reply({ephemeral: true, content: `Уровень подписки "${name}" успешно обновлён`})
                } else {
                    await submitted.reply({
                        ephemeral: true,
                        content: `Возникла ошибка при создании уровня подписки: ${response.data.error}`
                    })
                }
            }).catch()
            {

            }

        } catch (err: any) {
            await submitted.reply({
                ephemeral: true,
                content: `Возникла ошибка при создании уровня подписки: ${err.message}`
            })
        }
    }
}

export const createSub = (interaction: ButtonInteraction) => {
    let customId = interaction.customId.split("#")
    const guild = interaction.guild!;
    createSubscribe({
        serverId: String(guild.id),
        tierId: Number(customId[1]),
        userId: String(interaction.user.id)
    }).then(async (response) => {
        let member = <GuildMember>interaction.member
        await member.roles.add(response.data.roleId)
        await interaction.reply({
            ephemeral: true,
            content: "Подписка успешно оформлена"
        })
    }).catch()
    {
    }
}

export const removeSub = (interaction: ButtonInteraction) => {
    const [bname, tierId, roleId] = interaction.customId.split("#")
    let guild = interaction.guild!;

    removeSubscribe({
        serverId: String(guild.id),
        tierId: Number(tierId),
        userId: String(interaction.user.id)
    }).then(async response => {
        if (response.data.ok) {
            let member = <GuildMember>interaction.member;
            await member.roles.remove(roleId);
            await interaction.reply({
                ephemeral: true,
                content: "Подписка отменена"
            })
        }
    })

}