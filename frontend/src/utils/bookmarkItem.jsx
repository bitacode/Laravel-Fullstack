export const saveItem = (itemId) => {
    const savedItems = JSON.parse(localStorage.getItem('savedOffices') || '[]');
    if (!savedItems.includes(itemId)) {
        const updatedItems = [...savedItems, itemId];
        localStorage.setItem('savedOffices', JSON.stringify(updatedItems));
        return true;
    }
    return false;
}

export const unsaveItem = (itemId) => {
    const savedItems = JSON.parse(localStorage.getItem('savedOffices') || '[]');
    const updatedItems = savedItems.filter(id => id !== itemId);
    localStorage.setItem('savedOffices', JSON.stringify(updatedItems));
}

export const isItemSaved = (itemId) => {
    const savedItems = JSON.parse(localStorage.getItem('savedOffices') || '[]');
    return savedItems.includes(itemId);
}

export const getSavedItems = () => {
    return JSON.parse(localStorage.getItem('savedOffices') || '[]');
}