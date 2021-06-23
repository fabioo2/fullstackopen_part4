const blogsRouter = require('express').Router();
const { response } = require('express');
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs);
    });
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
    const blog = new Blog(request.body);
    if (!blog.title || !blog.url) {
        response.status(400).end();
    } else {
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    }
});

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const blog = await Blog.findByIdAndUpdate(request.params.id, body, {
        new: true,
    });
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

module.exports = blogsRouter;