import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (_, res) => {
  res.send('Hello, what is up!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});