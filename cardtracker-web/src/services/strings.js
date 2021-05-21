// Use common card title (Year Manufacturer - Name)
export const card_title = (card) => {
    return `${card.year} ${card.manufacturer} ${card.set}- ${card.name}`;
};

// Use common card set title
export const set_title = (card) => {
    return `${card.year} ${card.manufacturer} ${card.set}`;
}
