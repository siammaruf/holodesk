export function formatEmailToName(email: string) {
    if (typeof email !== 'string') {
        return ''
    }

    const name = email.split('@')[0];
    // Replace common separators with spaces
    const spaced = name.replace(/[._-]/g, ' ');
    // Title case each word
    return spaced.replace(/\b\w/g, char => char.toUpperCase());
}
