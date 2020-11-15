const createError = async (status = 500, message = 'Something wrong') => {
    const err = new Error(message)
    err.status = status
    return err
}

const saveFile = async (file, root, path, filePrefix = '') => {
    filePrefix = (filePrefix) ? `${filePrefix}_` : ''
    const filePath = `${root}/${path}/${filePrefix}${file.name}`
    await file.mv(filePath, async function (err) {
        if (err) {
            return false
        }
    })
    return `/${path}/${filePrefix}${file.name}`
}

module.exports = {
    createError,
    saveFile
}
