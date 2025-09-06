import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';
import uploadRouter from './routes/upload';

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRouter);
app.use('/api', uploadRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on :${port}`);
});
