const multer = require('multer')


const storage= multer.diskStorage({
    destination: function (req, file, cb){
        cb (null, 'Avatares')
    },
    filename: function (req,file, cb){
        const extension = file.mimetype.split('/')[1]
        cb(null, `Avatar - ${req.body.email} - ${Date.now()}.${extension}`)
    }
})

const upload = multer({storage: storage})

exports.upload = upload.single('avatar')

exports.uploadFile = (req,res) => {

    res.send({data: "Cargar un archivo"})
}