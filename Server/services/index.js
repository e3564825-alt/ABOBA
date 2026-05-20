import express from 'express';
import cors from 'cors';

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

(async () => {
  const { default: UserController } = await import(
    './controllers/UserController.js'
  );
  app.use('/api/users', UserController);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
