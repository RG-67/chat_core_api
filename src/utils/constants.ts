import bCrypt from 'bcrypt';


export const hashPass = async (password: string) => {
    const genHass = bCrypt.hashSync(password, 10);
    return genHass;
}