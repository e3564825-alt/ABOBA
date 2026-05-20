require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loginRouter = require('./controllers/LoginController');
const userRouter = require('./controllers/UserController');

const app = express();
const port = Number(process.env.PORT) || 3011;

app.use(
  cors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  })
);
app.use(express.json());

app.use('/api', loginRouter);
app.use('/api/users', userRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
