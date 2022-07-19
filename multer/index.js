const multer = require('multer')

const multerStorage = multer.diskStorage(
    { destination: function (req, file, cb) {cb (null, 'Avatares')},
      filename:(req, file,cb)=>{
      const extension = file.mimetype.split('/')[1]
      cb(null, `Avatar - ${req.body.email} - ${Date.now()}.${extension}`)
      }
    }
  )

exports.default = multerStorage

