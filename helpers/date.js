
exports.dateToString = date => {
    try {
        const isoString = new Date(date).toISOString();
        return isoString;
    } catch (error) {
        return null; 
    }
};