const resetColor = '\x1b[0m'
const green = '\x1b[32m'
const red = '\x1b[31m'

const info = (...params) => {
    console.log(green,...params, resetColor)
}

const error = (...params) => {
    console.log(red, ...params, resetColor)
}

module.exports = {info, error}