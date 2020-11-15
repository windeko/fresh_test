const express = require('express')
const controller = require('./fileserverController')

const router = express.Router()

router.get('', controller.getFiles)
router.post('', controller.addFile)
router.delete('/:id', controller.deleteFile)

module.exports = router
