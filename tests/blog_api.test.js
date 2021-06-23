const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
});

test('all notes are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    blogs.forEach((blog) => {
        expect(blog.id).toBeDefined();
    });
});

test('a valid blog post can be added', async () => {
    const newBlog = {
        title: 'Test Blog Post',
        author: 'Fabio Cat',
        url: 'catbio.com',
        likes: 0,
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map((t) => t.title);
    expect(titles).toContain('Test Blog Post');
});

test('a missing likes property will default to zero', async () => {
    const newBlog = {
        title: 'Test Blog Post',
        author: 'Fabio TV',
        url: 'tvbio.com',
    };

    const test = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    expect(test.body.likes).toBe(0);
});

test('a blog with missing title and url properties responds with a 400 Bad Request', async () => {
    const newBlog = {
        author: 'Fabio Kim',
        likes: 1000,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
});

afterAll(() => {
    mongoose.connection.close();
});
