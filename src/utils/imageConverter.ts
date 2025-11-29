import type {UploadFile} from "antd";

/**
 * Converting file object to Base64 string
 * @param file
 * @return promise returning Base64
 */
const fileToBase64 = (file: File) : Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Converting file list from AntD Upload to Base64 string
 * @param fileList
 * @return base64
 */
export const convertUploadFilesToBase64 = async (fileList: UploadFile[]): Promise<string[]> => {
    const validFiles = fileList
        .map(file => file.originFileObj)
        .filter(Boolean) as File[]

    if (validFiles.length === 0) {
        return [];
    }

    const promises = validFiles.map(file => fileToBase64(file));

    return await Promise.all(promises);
};

/**
 * Mapping Base64 to upload file type
 * @param base64Strings
 */
export const mapBase64ToUploadFile = (base64Strings: string[]): UploadFile[] => {
    return base64Strings.map((base64, index) => ({
        uid: `-${index + 1}`,
        name: `image-${index + 1}.png`,
        status: 'done',
        url: base64,
    }));
};
