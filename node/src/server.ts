import 'dotenv/config';
import express from 'express';

import { routes } from '@infra/http/routes';

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(routes);

app.listen(PORT, () =>
  console.log(`🔥 Server is running on http://localhost:${PORT}`),
);
