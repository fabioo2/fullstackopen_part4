// const { keyBy } = require('lodash');
const _ = require('lodash');

const dummy = () => {
    return 1;
};

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0;
    } else if (blogs.length === 1) {
        return blogs[0].likes;
    } else {
        const reducer = (sum, item) => {
            return sum + item.likes;
        };

        return blogs.reduce(reducer, 0);
    }
};

const favoriteBlog = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)[0];
};

const mostBlogs = (blogs) => {
    const picked = _.map(blogs, (o) => _.omit(o, ['_id', 'likes', 'url', '__v']));

    const result = _(picked)
        .groupBy((x) => x.author)
        .map((value, key) => ({ author: key, blogs: value }))
        .value();

    const mapped = _.map(result, (x) => {
        return {
            author: x.author,
            blogs: x.blogs.length,
        };
    });
    console.log(mapped);
    return _.maxBy(mapped, 'blogs');
};

const mostLikes = (blogs) => {
    const picked = _.map(blogs, (o) => _.omit(o, ['_id', 'title', 'url', '__v']));

    const summed = _(picked)
        .groupBy('author')
        .map((objs, key) => {
            return {
                author: key,
                likes: _.sumBy(objs, 'likes'),
            };
        })
        .value();

    return _.maxBy(summed, 'likes');
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes,
    mostBlogs,
};
