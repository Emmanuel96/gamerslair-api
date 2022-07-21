// eslint-disable-next-line @typescript-eslint/no-var-requires
import dotenv from 'dotenv'
dotenv.config()

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3002;

const URI: string = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI || ''
  : process.env.MONGODB_URI || ''

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || '' 

const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || '' 

const config = { PORT, URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET }

export default config