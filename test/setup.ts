import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  console.log('Starting E2E tests...');
});

afterAll(async () => {
  await mongod.stop();
  console.log('Finished E2E tests.');
});