import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    ModalActionRowComponentBuilder
} from "discord.js";

export const subTierCreateModal = (name1 = "", price1 = "", description1 = "") => {
    const modal = new ModalBuilder()
        .setCustomId("modal-addTier")
        .setTitle(`Добавить уровень подписки`);

    const name = new TextInputBuilder()
        .setCustomId("modal-addTier-name")
        .setLabel("Отображаемое название")
        .setStyle(TextInputStyle.Short)
        .setValue(name1)
        .setRequired(true);

    const price = new TextInputBuilder()
        .setCustomId("modal-addTier-price")
        .setLabel("Цена")
        .setStyle(TextInputStyle.Short)
        .setValue(price1)
        .setRequired(true);

    const description = new TextInputBuilder()
        .setCustomId("modal-addTier-description")
        .setLabel("Описание уровня подписки и её преимуществ")
        .setStyle(TextInputStyle.Paragraph)
        .setValue(description1)
        .setRequired(true);

    const nameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(name);
    const costActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(price);
    const descriptionActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(description);

    modal.addComponents(nameActionRow, costActionRow, descriptionActionRow);

    return modal;
};