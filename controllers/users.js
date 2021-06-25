const bcrypt = require('bcrypt');
const { response } = require('express');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
    const body = request.body;

    if (!body.password) {
        return response
            .status(400)
            .json({
                error: 'password is required'
            })
            .end();
    } else if (body.password.length < 3) {
        return response
            .status(400)
            .json({
                error: 'password must be at least 3 characters'
            })
            .end();
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
});

usersRouter.get('/', async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

module.exports = usersRouter;
