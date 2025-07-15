import mongoose from 'mongoose';
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
  const app = express();

  app.use(express.json());
  app.use(cors());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  await mongoose.connect(`${process.env.SURGERY_DATABASE_CONNECTION_CREDENTIALS!}testdb`);

  const schema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true }
  });
  
  const model = mongoose.model('testCollection', schema, 'testCollection');

  app.get('/', async (_, res) => {
    const testResult = await model.findOne({ name: "Iforgot" });

    if (!testResult) {
      return res.status(404).send("Document not found");
    }
    
    res.send(`Surname: ${testResult!.surname}`);
  });

})();