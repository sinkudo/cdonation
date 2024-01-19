import {
    Locale,
    ApplicationCommandType,
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle, ActionRowBuilder, MessageActionRowComponentBuilder, TextChannel, ButtonInteraction, ChannelType
} from "discord.js";
import {subTierCreateModal} from "@/components/modals/subTierCreateModal";
import {subTierCreate} from "@/controlers/tier";

export const data = new SlashCommandBuilder()
    .setName("tier")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("create")
            .setDescription("Добавить уровень подписки")
    )
    .setDescription("Настройка уровней подписки");

const subcommands = {
    "create": create
}

type subcommand = keyof typeof subcommands;

export const execute = async (interaction: ChatInputCommandInteraction) => subcommands[interaction.options.getSubcommand() as subcommand](interaction);

async function create(interaction: ChatInputCommandInteraction) {
    await interaction.showModal(subTierCreateModal())

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
            guild.roles.create({name: name}).then(async role => {
                subTierCreate({
                    price: price,
                    name: name,
                    description: description,
                    serverid: String(guild.id),
                    creatorid: String(interaction.user.id),
                    roleid: String(role.id)
                }).then(async response => {
                    if (response.data.ok) {
                        await guild.channels.create({
                            name: `Комната ${name}`, type: ChannelType.GuildText, permissionOverwrites: [
                                {
                                    id: role.id,
                                    allow: [
                                        PermissionFlagsBits.ViewChannel,
                                        PermissionFlagsBits.SendMessages,
                                        PermissionFlagsBits.ReadMessageHistory
                                    ],
                                },
                                {
                                    id: guild.roles.everyone.id,
                                    deny: [
                                        PermissionFlagsBits.ViewChannel,
                                        PermissionFlagsBits.SendMessages,
                                        PermissionFlagsBits.ReadMessageHistory
                                    ],
                                }
                            ]
                        })
                        await submitted.reply({ephemeral: true, content: `Уровень подписки "${name}" успешно создан`})
                    } else {
                        await submitted.reply({
                            ephemeral: true,
                            content: `Возникла ошибка при создании уровня подписки: ${response.data.error}`
                        })
                        await role.delete()
                    }
                }).catch(async () => {
                    await submitted.reply({
                        ephemeral: true,
                        content: `Возникла ошибка при создании уровня подписки: Сервер недоступен`
                    })
                    await role.delete()
                })
            });
        } catch (err: any) {
            await submitted.reply({
                ephemeral: true,
                content: `Возникла ошибка при создании уровня подписки: ${err.message}`
            })
        }
    }
}