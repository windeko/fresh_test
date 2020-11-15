const fileServer = require('./fileserverModel')

const allowedFiles = ['jpg', 'jpeg', 'png', 'xlsx']
const filesFolder = `files`

const checkGotFile = (reqFiles) => {
    try {
        if (!reqFiles || !('file' in reqFiles)) {
            return { status: 400, error: "файл не был передан" }
        }
        const fNameSplit = reqFiles.file.name.split('.')
        if (fNameSplit.length !== 2 || !allowedFiles.includes(fNameSplit[1])) {
            return { status: 400, error: "формат файла недопустим для загрузки" }
        }
        return reqFiles.file
    } catch (e) {
        return { status: 500, error: e.message }
    }
}

const saveFile = async(file) => {
    try {
        const prefix = Math.random().toString(36).substring(7)

        const path = await global.helper.saveFile(file, global.rootDir, filesFolder, prefix)

        if (!path) {
            return { status: 500, error: 'файл не был загружен' }
        }
        file.name = `${prefix}_${file.name}`

        const res = await fileServer.addFile(file, path)

        return res
    } catch (e) {
        return { status: 500, error: e.message }
    }
}

const getFiles = async (query) => {
    try {
        const limit = ('limit' in query) ? parseInt(query.limit) : 5
        const page = ('page' in query) ? parseInt(query.page) : 1
        const sort = ('sort' in query && ['asc', 'desc'].includes(query.sort)) ? query.sort : 'asc'

        const files = await fileServer.getFiles(limit, page, sort)
        return files
    } catch (e) {
        return { status: 500, error: e.message }
    }
}

const deleteFile = async (id) => {
    try {
        const file = await fileServer.findById(id)
        if (!file) {
            return { status: 404, error: 'файл не найден' }
        }
        await file.deleteFile()
        return { result: 'deleted' }
    } catch (e) {
        return { status: 500, error: e.message }
    }
}

module.exports = {
    checkGotFile,
    saveFile,
    getFiles,
    deleteFile
}
