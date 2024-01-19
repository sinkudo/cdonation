import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    ModalActionRowComponentBuilder
} from "discord.js";

export const subTierCreateModal = () => {
    const modal = new ModalBuilder()
        .setCustomId("modal-addTier")
        .setTitle(`Добавить уровень подписки`);

    const name = new TextInputBuilder()
        .setCustomId("modal-addTier-name")
        .setLabel("Отображаемое название")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const cost = new TextInputBuilder()
        .setCustomId("modal-addTier-price")
        .setLabel("Цена")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const description = new TextInputBuilder()
        .setCustomId("modal-addTier-description")
        .setLabel("Описание уровня подписки и её преимуществ")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const nameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(name);
    const costActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(cost);
    const descriptionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(description);

    modal.addComponents(nameActionRow, costActionRow, descriptionActionRow);

    return modal;
};