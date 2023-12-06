import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

export function uploadFiles({ files, userIdentifier }: { files: Express.Multer.File[]; userIdentifier: string }) {
  files.forEach((file) => {
    if (!file) return;

    const filePath = getUploadPathByFile({ file, userIdentifier });

    writeFileWithDirectories(filePath, file.buffer);
  });
}

export function getUploadPathByFile({ file, userIdentifier }: { file: Express.Multer.File; userIdentifier: string }) {
  const uploadPath = getUploadPath({ userIdentifier, fileDir: file.fieldname, fileName: file.originalname });

  return uploadPath;
}

export function getUploadPath({
  userIdentifier,
  fileDir,
  fileName,
}: {
  userIdentifier: string;
  fileDir: string;
  fileName: string;
}) {
  let destination = 'uploads';

  const uploadPath = join(process.cwd(), destination, makeSafeFolderName(userIdentifier), fileDir, fileName);

  return uploadPath;
}

export function writeFileWithDirectories(filePath: string, content: Buffer) {
  const directory = dirname(filePath);

  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  writeFileSync(filePath, content, 'utf8');
}

export function makeSafeFolderName(str: string): string {
  return str.replace(/[\/\\?%*:|"<>]/g, '-');
}

const ALLOWED_IMG_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export function validateImageMimeType(file?: Express.Multer.File) {
  return !ALLOWED_IMG_MIME_TYPES.includes(file.mimetype);
}
