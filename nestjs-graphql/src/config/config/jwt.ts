import * as Path from 'path';
import * as FS from 'fs-extra';

export const jwtCredentials = {
  privateKey: FS.readFileSync(
    Path.resolve(__dirname, '..', '..', '..', 'etc', 'cert', 'private.key'),
    'utf8',
  ),
  publicKey: FS.readFileSync(
    Path.resolve(__dirname, '..', '..', '..', 'etc', 'cert', 'public.key'),
    'utf8',
  ),
};
