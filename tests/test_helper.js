const Blog = require('../models/blog');
const User = require('../models/user');

const usersInDb = async () => {
    const users = await User.find({});
    return users.map((u) => u.toJSON());
};

const initialBlogs = [
    {
        title: 'Test Blog Post 1',
        author: 'Fabio Fish',
        url: 'fishbio.com',
        likes: 0
    },
    {
        title: 'Test Blog Post 2',
        author: 'Fabio Dog',
        url: 'dogbio.com',
        likes: 0
    }
];

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb
};
