import * as bcrypt from 'bcryptjs';

export const HashPassowrd = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return hash
}

export const ComparePassowrd = async (passwordToCheck: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(passwordToCheck, hashedPassword);

    return isMatch
}