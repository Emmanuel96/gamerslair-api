export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URI: string;
      TEST_MONGODB_URI: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      // ENV: 'test' | 'dev' | 'prod';
    }
  }
}