import dotenv from 'dotenv';
import app from './app';
import { migrateDatabase, dropDatabase } from './database/migratedb';

dotenv.config();

const port = process.env.PORT || 6000;

migrateDatabase();
// dropDatabase();

app.listen(port, async () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
