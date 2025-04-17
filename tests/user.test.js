const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }

  await mongoose.connect('mongodb://localhost:27017/userdb_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  const db = mongoose.connection;
  if (db.readyState !== 0) {
    await db.dropDatabase();
    await db.close();
  }
});

describe('User API', () => {
  let userId;

  test('should create a user', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'Alice',
      email: 'alice@example.com',
      age: 28,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Alice');
    userId = res.body._id;
  });

  test('should fetch all users', async () => {
    await User.create({ name: 'Bob', email: 'bob@example.com', age: 32 });

    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('should update a user', async () => {
    const user = await User.create({ name: 'Charlie', email: 'charlie@example.com', age: 24 });

    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .send({ age: 29 });

    expect(res.statusCode).toBe(200);
    expect(res.body.age).toBe(29);
  });
});
