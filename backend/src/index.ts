import { MongoClient } from 'mongodb';
import express from 'express';
import cors from 'cors';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        [key: string]: any;
      };
    }
  }
}

(async () => {
  const client = new MongoClient(process.env.SURGERY_DATABASE_CONNECTION_CREDENTIALS!);

  const app = express();

  app.use(express.json());
  app.use(cors());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  const mongoDb = await connectToMongo();

  async function connectToMongo() {
    await client.connect();
    return client.db("testdb");
  }

  app.get('/', async (_, res) => {
    const testCollection = mongoDb.collection("testCollection");

    const test = await testCollection.findOne({ name: "Iforgot" });

    res.send(`Surname: ${test!.surname}`);
  });


})();