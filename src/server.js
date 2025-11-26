import 'dotenv/config';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT ?? 3000;

app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// маршрут, що повертає всі нотатки

app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// маршрут, що повертає нотатку за її id

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

//маршрут для імітації виникнення помилки

app.get('/test-error', (req, res, next) => {
  next(new Error('Simulated server error'));
});

//middleware для неіснуючих маршрутів

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// middleware для обробки помилок

app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

//слухаємо порт

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
