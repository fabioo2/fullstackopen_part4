const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Blog = require('../models/blog');

describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'fkim',
            name: 'Fabio Kim',
            password: 'tonyromo'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper status code and message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'tonyromo'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('`username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper status code and message if username is not at least 3 characters', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'ra',
            name: 'fabio kim',
            password: 'tonyromo'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('is shorter than the minimum allowed length (3).');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper status code and message if password is not at least 3 characters', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'fabiokim23',
            name: 'fabio kim',
            password: '12'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('password must be at least 3 characters');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
