import * as dotenv from 'dotenv';

export const dotenvConfig = (envFile: string) => {
  dotenv.config({ path: envFile });
};
