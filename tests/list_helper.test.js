const listHelper = require('../utils/list_helper')
const { initialBlogs } = require('./test_helper')

describe('dummy', () => {
  test('returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('likes count', () => {
  test('blogs.length === 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('blogs.length === 1', () => {
    const result = listHelper.totalLikes([initialBlogs[0]])
    expect(result).toBe(7)
  })

  test('blogs.length > 1', () => {
    const result = listHelper.totalLikes(initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('blogs.length === 0', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('blogs.length === 1', () => {
    const result = listHelper.favoriteBlog([initialBlogs[0]])
    expect(result).toEqual(initialBlogs[0])
  })

  test('blogs.length > 1', () => {
    const result = listHelper.favoriteBlog(initialBlogs)
    expect(result).toEqual(initialBlogs[2])
  })
})

describe('most blogs', () => {
  test('blogs.length === 0', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('blogs.length === 1', () => {
    const result = listHelper.mostBlogs([initialBlogs[0]])
    expect(result).toEqual({ author: 'Michael Chan', blogs: 1 })
  })

  test('blogs.length > 1', () => {
    const result = listHelper.mostBlogs(initialBlogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('blogs.length === 0', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

  test('blogs.length === 1', () => {
    const result = listHelper.mostLikes([initialBlogs[0]])
    expect(result).toEqual({ author: 'Michael Chan', likes: 7 })
  })

  test('blogs.length > 1', () => {
    const result = listHelper.mostLikes(initialBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})
