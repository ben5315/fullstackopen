const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((prev, curr) => (prev && prev.likes > curr.likes) ? prev : curr)
}

const mostActiveAuthor = (blogs) => {
    let maxEl = blogs[0].author
    let maxVal = 1
    let count = {}
    for (var i = 0; i < blogs.length; i++) {
        el = blogs[i].author
        if (!count[el]) {
            count[el] = 1
        } else {
            count[el]++
        }
        if (count[el] > maxVal) {
            maxEl = el
            maxVal = count[el]
        }
    }
    return({ author: maxEl, count: maxVal })
}

const mostLikedAuthor = (blogs) => {
    let maxEl = blogs[0].author
    let maxVal = blogs[0].likes
    let count = {}
    for (var i = 0; i < blogs.length; i++) {
        el = blogs[i].author
        if (!count[el]) {
            count[el] = blogs[i].likes
        } else {
            count[el] += blogs[i].likes
        }
        if (count[el] > maxVal) {
            maxEl = el
            maxVal = count[el]
        }
    }
    return({ author: maxEl, likes: maxVal })
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostActiveAuthor,
    mostLikedAuthor,
}