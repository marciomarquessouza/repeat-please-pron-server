declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      RDS_HOSTNAME: string;
      RDS_USERNAME: string;
      RDS_PASSWORD: string;
      RDS_DB_NAME: string;
      JWT_SECRET: string;
    }
  }
}

export {};
