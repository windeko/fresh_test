const mongoose = require('mongoose')
const moment = require('moment')

const fileServerSchema = mongoose.Schema({
    name: String,
    size: Number,
    path: String,

    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: moment.now() },
    deletedAt: { type: Date }
})

fileServerSchema.methods.deleteFile = async function () {
    const file = this
    file.isDeleted = true
    file.deletedAt = moment.now()
    await file.save()
}

fileServerSchema.statics.addFile = async (file, path) => {
    const newFile = new fileServer()
    newFile.name = file.name
    newFile.size = file.size
    newFile.path = path
    const res = await newFile.save()
    return res
}

fileServerSchema.statics.getFiles = async (limit, page, sort) => {
    const skip = limit * (page - 1)
    const params = { isDeleted: false }
    const projection = '-_id name size createdAt'

    const fullListCount = await fileServer.find(params).countDocuments()
    /*
    Сортировка по _id а не по дате потому, что _id - это по сути хэш-функция от даты и она всегда отображает
    порядок вставки в таблицу, в то время как сортировка по дате требует больше времени и дополнительного индекса
    */
    const resp = {
        files: await fileServer
            .find(params, projection)
            .sort({ _id: sort })
            .limit(limit)
            .skip(skip)
    }
    resp.count = resp.files.length
    resp.limit = limit
    resp.pages = Math.ceil(fullListCount / limit)
    return resp
}

const fileServer = mongoose.model('FileServer', fileServerSchema)

module.exports = fileServer
