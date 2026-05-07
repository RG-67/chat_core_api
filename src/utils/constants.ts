import bCrypt from 'bcrypt';


export const hashPass = async (password: string) => {
    const genHass = bCrypt.hashSync(password, 10);
    return genHass;
}


export const compareHass = async (originalPass: string, hass: string) => {
    const isMatch = bCrypt.compareSync(originalPass, hass);
    return isMatch;
}