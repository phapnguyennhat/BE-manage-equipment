import { Injectable } from '@nestjs/common';
import { rejects } from 'assert';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { error } from 'console';
import { resolve } from 'path';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: 'dyzxlyroj',
      api_key: '375214827664734',
      api_secret: 'C10KznuirJlLiTepn-2IlWgNEWA',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, rejects) => {
      v2.uploader
        .upload_stream(
          { resource_type: 'auto', folder: folder },
          (error, result) => {
            if (error) return rejects(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
