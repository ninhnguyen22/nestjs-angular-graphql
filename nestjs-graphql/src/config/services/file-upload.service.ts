import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import * as uuid from 'uuid/v4';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../logger';

export class FileUploadService {
  async upload(fileInput: FileUpload): Promise<string> {
    const {createReadStream, filename} = fileInput;
    const fileNameOutput = `${uuid()}-${filename}`;
    const filePathOutput = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'uploads',
      fileNameOutput,
    );

    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePathOutput))
        .on('finish', () => resolve(`/uploads/${fileNameOutput}`))
        .on('error', (err) => {
          logger.error(err.toString());
          reject(null);
        }),
    );
  }

  async delete(filePath: string): Promise<boolean> {
    const prefixPath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'public',
    );
    return new Promise(async (resolve, reject) => {
        const fullPath = `${prefixPath}${filePath}`;
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
        resolve(true);
      },
    );

  }
}
