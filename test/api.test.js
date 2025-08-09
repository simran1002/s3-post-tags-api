const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Blog API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-api-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.collections.posts?.deleteMany({});
    await mongoose.connection.collections.tags?.deleteMany({});
  });

  describe('Tags', () => {
    test('should create a new tag', async () => {
      const response = await request(app)
        .post('/api/tags')
        .send({ name: 'Technology' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('technology');
    });

    test('should get all tags', async () => {
      await request(app).post('/api/tags').send({ name: 'Programming' });

      const response = await request(app).get('/api/tags');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('Posts', () => {
    test('should create a new post', async () => {
      const response = await request(app)
        .post('/api/posts')
        .field('title', 'Test Post')
        .field('desc', 'This is a test post');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Post');
    });

    test('should get all posts', async () => {
      await request(app)
        .post('/api/posts')
        .field('title', 'Test Post')
        .field('desc', 'This is a test post');

      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    test('should search posts', async () => {
      await request(app)
        .post('/api/posts')
        .field('title', 'JavaScript Tutorial')
        .field('desc', 'Learn JavaScript basics');

      const response = await request(app)
        .get('/api/posts/search?q=javascript');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });
}); 