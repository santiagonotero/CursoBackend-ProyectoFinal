const multer = require('multer')

module.exports={
    uploadFile:(req,res,next)=>{
        console.log('multer.uploadFile')
        const multerStorage = multer.diskStorage(
            { destination: (req, file, cb)=>{cb(null, 'Avatares/')},
            filename:(req, file, cb)=>{
            const extension = file.mimetype.split('/')[1]
            cb(null, `Avatar - ${req.body.email} - ${Date.now()}.${extension}`)
            }
            }
        )
        console.log(req.file)
        const upload= multer({storage: multerStorage}).single('avatar')
        next()

    }
}

