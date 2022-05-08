import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN || '';

const config = { token };

export default config;
