import {fileTypeImgList} from '@/utils/consts'

/**
 *
 * @param a 文件大小，字节
 * @param b
 * @returns {string}
 */
export function formatFileSize(a, b) {
    if (0 === a) return "0 Bytes";
    const c = 1024,
        d = b || 2,
        e = ["Bytes",
            "KB",
            "MB",
            "GB",
            "TB",
            "PB",
            "EB",
            "ZB",
            "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

/**
 * 根据文件名称（后缀）获取图片
 * @param fileName
 * @returns {string}
 */
export function getTypeImgByFileName(fileName) {
    let type = fileTypeImgList.other
    if (fileName) {
        let index1 = fileName.lastIndexOf(".")
        if (index1 !== -1) {
            let suffix = fileName.substring(index1 + 1, fileName.length)
            type = fileTypeImgList[suffix] || type
        }
    }
    return type
}

export function isImg(f) {
    return /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(f);
}

export function isVideo(f) {
    return /\.(mp4|avi|mkv|wmv|webm|MP4|AVI|MKV|WMV|WEBM)$/.test(f);
}
