const fsLogic = require('./fileserverLogic')

const addFile = async (req, res, next) => {
    try {
        const file = fsLogic.checkGotFile(req.files)
        if ('error' in file) {
            return next(await global.helper.createError(file.status, file.error))
        }
        const savedFile = await fsLogic.saveFile(file)
        if ('error' in savedFile) {
            return next(await global.helper.createError(savedFile.status, savedFile.error))
        }

        res.status(200).send(savedFile)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
}

const getFiles = async (req, res, next) => {
    try {
        const files = await fsLogic.getFiles(req.query)
        res.send(files)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
}

const deleteFile = async (req, res, next) => {
    try {
        const result = await fsLogic.deleteFile(req.params.id)
        if ('error' in result) {
            return next(await global.helper.createError(result.status, result.error))
        }

        res.send(result)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
}

module.exports = {
    addFile,
    getFiles,
    deleteFile
}
