const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
        response.status(404).end()
    }
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true, runValidators: true }
    )

    if (!updatedBlog) {
        return response.status(404).end()
    }

    response.status(200).json(updatedBlog)
})

module.exports = blogRouter