const blogsRouter = require('express').Router();
const { response } = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1
    });

    response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogsRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({}, {}, { sort: { created_at: -1 } }, function (err, post) {
        console.log(post);
    });
    console.log(user);

    const blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        user: user._id
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const blog = await Blog.findByIdAndUpdate(request.params.id, body, {
        new: true
    });
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

module.exports = blogsRouter;
