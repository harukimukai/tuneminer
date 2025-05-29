const fs = require('fs')
const path = require('path')

const deleteUploadedFiles = (files) => {
    if (!files) return

    for (const fieldname in files) {
        files[fieldname].forEach((file) => {
            const filePath = path.join(__dirname, '..', file.path)
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${filePath}`, err)
                } else {
                    console.log(`Deleted file: ${filePath}`);
                }
            })
        })
    }
}

module.exports = deleteUploadedFiles