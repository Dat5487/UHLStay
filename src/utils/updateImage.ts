
import fs from "fs";
import path from "path";
import type {Motel} from "../types";

const JSON_FILE_PATH = path.join(__dirname, 'motels.json');
const IMAGES_DIR = path.join(__dirname, 'image');
const PUBLIC_IMAGE_PATH = '/image';

async function updateMotelImages(): Promise<void> {
    try {
        const motelsData: Motel[] = JSON.parse(fs.readFileSync(JSON_FILE_PATH, 'utf-8'));
        console.log(`Đã đọc thành công ${motelsData.length} phòng trọ từ JSON.`);

        const motelFolders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log(`Tìm thấy ${motelFolders.length} thư mục ảnh.`);

        motelsData.forEach(motel => {
            const motelId = motel.id;
            const folderName = `motel_${motelId}`;


            if (motelFolders.includes(folderName)) {
                const motelImagePath = path.join(IMAGES_DIR, folderName);


                const imageFiles = fs.readdirSync(motelImagePath)
                    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

                motel.images = imageFiles.map(file => `${PUBLIC_IMAGE_PATH}/${folderName}/${file}`);

                if (motel.images.length > 0) {
                    console.log(`   - Cập nhật ${motel.images.length} ảnh cho motel ID: ${motelId}`);
                }
            }
        });

        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(motelsData, null, 2), 'utf-8');
        console.log('Cập nhật file motels.json thành công!');

    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
    }
}
updateMotelImages();