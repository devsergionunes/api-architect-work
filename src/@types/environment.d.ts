declare namespace NodeJS {
  export interface ProcessEnv {
    //	Ambiente
    ENVIRONMENT: 'development' | 'production' | 'test';

    //	Parâmetros Gerais do sistema
    API_PORT: number;

    // JWT
    JWT_SECRET: string;

    //	Database
    DB_DATA_BASE: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
  }
}
