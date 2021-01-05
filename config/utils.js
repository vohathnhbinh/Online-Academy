const mongoose = require('mongoose')

const convertId = (id) => {
    if(mongoose.isValidObjectId(id)) {
        return id
    } else {
        return mongoose.Types.ObjectId(id)
    }
}

const utils = {
    convertId
}

module.exports = utils