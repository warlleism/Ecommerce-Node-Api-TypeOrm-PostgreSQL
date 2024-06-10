import fs from 'fs';
import path from 'path';
import { Base64Error } from '../helpers/api-erros';

export async function saveImageToFile(base64Image: string, filename: string): Promise<string> {

    function isValidBase64(str: string) {
        const base64Regex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=)?$/i;
        return base64Regex.test(str);
    }

    try {
        const base64Data = base64Image.replace('data:image', '');

        if (!isValidBase64(base64Data)) {
            throw new Base64Error('Arquivo não é um base64.');
        }

        const imageBuffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(__dirname, '..', 'images', filename);
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, imageBuffer);

        return filePath;
    } catch (error) {
        throw new Base64Error('Arquivo não é um base64.');
    }
}

export async function deleteImage(filename: string): Promise<void> {
    filename = filename + '.png'
    const filePath = path.join(__dirname, '..', 'images', filename);
    try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
    } catch (error) {
        throw error;
    }
}