import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { Express } from 'Express';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    const { mime } = await fileTypeFromBuffer(value.buffer);
    const MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!MIME_TYPES.includes(mime)) {
      throw new BadRequestException('The image should be either jpeg, png, or webp.');
    }

    return value;
  }
}
