import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/config';
import { swaggerSpec } from './config/swagger';
import apiRouter from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import { healthCheck, getMetrics, getVersion, trackRequest } from './controllers/health.controller';

const app: Application = express();

// ── Security ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin: config.CORS_ORIGIN.split(',').map((o) => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Request Parsing & Compression ───────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ─────────────────────────────────────────────────────────────────
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// ── Request timing middleware (for metrics) ──────────────────────────────────
app.use((_req, res, next) => {
  const start = Date.now();
  res.on('finish', () => trackRequest(Date.now() - start));
  next();
});

// ── System endpoints (no prefix — used directly by K8s probes) ──────────────
app.get('/health', healthCheck);
app.get('/metrics', getMetrics);
app.get('/version', getVersion);

// ── API v1 routes ────────────────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ── API Docs ─────────────────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'TECHFEST 2025 API',
  customCss: '.swagger-ui .topbar { display: none }',
}));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

// ── 404 / Error ──────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
