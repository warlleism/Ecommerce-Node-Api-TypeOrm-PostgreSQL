import fs from 'fs';
import path from 'path';

export async function saveImageToFile(base64Image: string, filename: string): Promise<string> {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(__dirname, '..', 'products_image', filename);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, imageBuffer);
    return filePath;
}
