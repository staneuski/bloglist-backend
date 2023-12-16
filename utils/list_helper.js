const dummy = (blogs) => { // eslint-disable-line no-unused-vars
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

module.exports = { dummy, totalLikes }