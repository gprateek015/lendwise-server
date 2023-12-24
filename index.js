import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routers
import userRouter from './routes/user.js';
import loanRouter from './routes/loan.js';
import installmentRouter from './routes/installment.js';
import adminRouter from './routes/admin.js';

import { authenticateAdmin, authenticateUser } from './middlewase.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

mongoose.connect(process.env.DB_URI).then(
  () => console.log('Database connected'),
  err => console.log('Error connecting database ', err)
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/loan', authenticateUser, loanRouter);
app.use('/installment', authenticateUser, installmentRouter);
app.use('/admin', authenticateAdmin, adminRouter);

app.get('/', (req, res) => {
  res.status(200).send('Server is up and running!');
});

app.all('*', async (req, res) => {
  res.status(404).send({ error: 'Url not found!' });
});

app.use((err, req, res, next) => {
  const { status_code = 500 } = err;
  if (!err.message) err.message = 'internal_server_error';
  res.status(status_code).send({
    error: err.message
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
