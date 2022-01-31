const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    url: { type: String, required: true },
    likes: { type: Number, default: 0 },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [{ comment: { type: String } }],
});

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        // returnedObject.comments = returnedObject.comments.map((comment) => ({
        //     id: comment._id.toString(),
        //     comment: comment.comment,
        // }));
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
