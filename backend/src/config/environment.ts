import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  clientOrigin: string;
  productDataSource: 'fakestore' | 'local';
  fakeStoreApiUrl: string;
  emailProvider: 'memory' | 'console' | 'smtp';
  salesInboxEmail: string;
  smtp: {
    host: string;
    port: number;
    user?: string;
    pass?: string;
    secure: boolean;
  };
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  productDataSource: (process.env.PRODUCT_DATA_SOURCE as any) === 'local' ? 'local' : 'fakestore',
  fakeStoreApiUrl: process.env.FAKE_STORE_API_URL || 'https://fakestoreapi.com',
  emailProvider: (process.env.EMAIL_PROVIDER as any) || 'memory',
  salesInboxEmail: process.env.SALES_INBOX_EMAIL || 'sales@catalogue.example.com',
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    secure: process.env.SMTP_SECURE === 'true'
  }
};
