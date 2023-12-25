const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    url: 'https://reactpatterns.com/',
    title: 'React patterns',
    author: 'Michael Chan',
    user: '658962e7c16b245fe7c1d78e',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    user: '65895c450ae370f93b21a9a7',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    user: '65895c450ae370f93b21a9a7',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    title: 'First class tests',
    author: 'Robert C. Martin',
    user: '65895eb86e6fb901ab7140b4',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    user: '65895eb86e6fb901ab7140b4',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    title: 'Type wars',
    author: 'Robert C. Martin',
    user: '65895eb86e6fb901ab7140b4',
    likes: 2,
    __v: 0
  }
]

const initialUsers = [
  {
    _id: '65895c450ae370f93b21a9a7',
    username: 'Dijkstra',
    password: 'Dijkstra1930',
    name: 'Edsger W. Dijkstra',
    blogs: ['5a422aa71b54a676234d17f8', '5a422b3a1b54a676234d17f9'],
    __v: 0
  },
  {
    _id: '658962e7c16b245fe7c1d78e',
    username: 'chantastic',
    password: 'chan@react.dev',
    name: 'Michael Chan',
    blogs: ['5a422a851b54a676234d17f7'],
    __v: 0
  },
  {
    _id: '65895eb86e6fb901ab7140b4',
    username: 'UncleBob',
    password: 'Agile2002',
    name: 'Robert C. Martin',
    blogs: ['5a422b891b54a676234d17fa', '5a422ba71b54a676234d17fb', '5a422bc61b54a676234d17fc'],
    __v: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Example Domain', url: 'https://example.com/' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  nonExistingId,
  usersInDb
}