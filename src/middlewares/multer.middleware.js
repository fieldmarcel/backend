import multer from "multer"

//follwoing code from multer github+ some modifications   cb-callback
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, file.originalname)

}
  
})
  
  export const upload = multer({ storage })

  