import 'reflect-metadata';
import RunServer from './api/RunServer';
import dotenv from 'dotenv'
dotenv.config()
const server = RunServer();
