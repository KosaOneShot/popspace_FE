
const birthDateFormat = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length >= 5 && digits.length < 7) {
        formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else if (digits.length >= 7) {
        formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    }
    return formatted;
};

export default birthDateFormat;
