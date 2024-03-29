// Use common card title (Year Manufacturer - Name)
export const cardTitle = (card) => {
    return `${card.year} ${card.manufacturer} ${card.set} - ${card.name}`;
};

// Use common card set title
export const setTitle = (card) => {
    return `${card.year} ${card.manufacturer} ${card.set}`;
}
