const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)

describe('When there are pre-existing blogs in the DB', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('Blogs are returned as JSON', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('All blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('A valid blog can be added', async () => {
        const blog = {
            author: "John Smith",
            title: "Blog title",
            url: "https://www.url.com",
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.getAllBlogs()
        assert.toString(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const authors = blogsAtEnd.map(b => b.author)
        assert(authors.includes(blog.author))
    })

    test('Check name of \'id\' property', async () => {
        const blogs = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const blog = blogs.body[0]
        assert(blog.hasOwnProperty('id') && !blog.hasOwnProperty('_id'))
    })

    describe('When adding a new note', () => {
        test('Likes default to 0', async () => {
            const blog = {
                author: "John Smith",
                title: "Blog title",
                url: "https://www.url.com",
            }

            const response = await api
                .post('/api/blogs')
                .send(blog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test('Fails with status 400 if missing title', async () => {
            const blog = {
                author: "John Smith",
                url: "https://www.url.com",
            }

            await api
                .post('/api/blogs')
                .send(blog)
                .expect(400)

            const blogsAtEnd = await helper.getAllBlogs()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('Fails with status 400 if missing url', async () => {
            const blog = {
                author: "John Smith",
                title: "Invalid Blog"
            }

            await api
                .post('/api/blogs')
                .send(blog)
                .expect(400)

            const blogsAtEnd = await helper.getAllBlogs()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

    })

    describe('Deleting a blog', () => {
        test('Succeeds with status 204 if id is valid', async () => {
            const blogsAtStart = await helper.getAllBlogs()
            const blogToDelete = blogsAtStart[0]

            const deleted = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

            const blogsAtEnd = await helper.getAllBlogs()
            const titles = blogsAtEnd.map(b => b.title)

            assert(!titles.includes(blogToDelete.title))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        })

        test('Fails with status 404 if blog doesn\'t exist', async () => {
            const nonExistingId = await helper.nonExistingId()

            await api
                .delete(`/api/blogs/${nonExistingId}`)
                .expect(404)

            const blogsAtEnd = await helper.getAllBlogs()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('Fails with status 400 if id is invalid', async () => {
            const invalidId = 'abc123'

            await api.delete(`/api/blogs/${invalidId}`).expect(400)

            const blogsAtEnd = await helper.getAllBlogs()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('Updating a blog', () => {
        test('Succeeds with status 200 if id is valid', async () => {
            const blogsAtStart = await helper.getAllBlogs()
            const blogToUpdate = blogsAtStart[0]

            blogToUpdate.title = 'Altered title'
            blogToUpdate.author = 'Altered author'
            blogToUpdate.url = 'Altered URL'
            blogToUpdate.likes = 1

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)

            const blogsAtEnd = await helper.getAllBlogs()

            assert.deepStrictEqual(blogsAtEnd[0], blogToUpdate)
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('Fails with status 404 if blog doesn\'t exist', async () => {
            const nonExistingId = await helper.nonExistingId()

            await api
                .put(`/api/blogs/${nonExistingId}`)
                .send()
                .expect(404)

            const blogsAtEnd = await helper.getAllBlogs()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('Fails with status 400 if id is invalid', async () => {
            const invalidId = 'abc123'

            await api
                .put(`/api/blogs/${invalidId}`)
                .send()
                .expect(400)

            const blogsAtEnd = await helper.getAllBlogs()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})