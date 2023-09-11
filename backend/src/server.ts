import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import os from 'os';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import configs from './configs';
import router from './routes';

// Express App
const app: Application = express();
const port: number = configs.port || 8080;

const ip =
  os.networkInterfaces()['wlan0']?.[0].address ||
  os.networkInterfaces()['eth0']?.[0].address;

const corsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'X-Refresh-Token',
    'Authorization',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  origin: true,
  credentials: true
};

const PROFILE = path.join(__dirname, '..', 'uploads', 'profile-pictures');
const POST_IMAGES = path.join(__dirname, '..', 'uploads', 'post-images');
const POST_VIDEOS = path.join(__dirname, '..', 'uploads', 'post-videos');
const TEST_IMAGES = path.join(__dirname, '..', 'uploads', 'test-images');
const SUBMITION_IMAGES = path.join(
  __dirname,
  '..',
  'uploads',
  'submition-images'
);

// Middleware
// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads/profile-pictures', express.static(PROFILE));
app.use('/uploads/post-images', express.static(POST_IMAGES));
app.use('/uploads/post-videos', express.static(POST_VIDEOS));
app.use('/uploads/test-images', express.static(TEST_IMAGES));
app.use('/uploads/submition-images', express.static(SUBMITION_IMAGES));
app.use(express.urlencoded({ extended: false }));
app.use(router);

// Express Server
const server = http.createServer(app).listen(port, () => {
  console.log(`Backend server is listening on http://${ip}:${configs.port}`);
  console.log('Press CTRL+C to stop the server.');
});

export const io = new Server(server, { cors: corsOptions });

io.on('connection', (socket) => {});

export default app;
