const Busboy = require('busboy')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
formData = (req, res, next) => {
  let uploadingImage = false
  let uploadingCount = 0

  function done(){
    if(uploadingImage) return;
    if(uploadingCount > 0) return;
    next()
  }
  const busboy = new Busboy({ headers: req.headers })

  req.body = {}

  busboy.on('field', (key, val)=>{
    req.body[key] = val
  })
  busboy.on('file',(key, image) => {
    uploadingImage=true
    uploadingCount++
  
    const stream = cloudinary.uploader.upload_stream(
      (err, res) => {
        if(err) throw new Error('Something Went Wrong!!!')

        console.log('response',res.secure_url);
        req.body[key] = res
        uploadingImage = false
        uploadingCount--
        done()
      }
    )
    image.on('data', data => {
      console.log(data);
      stream.write(data)
    })
    image.on('end',()=>{
      console.log('finish');
      stream.end()
    })
  })
  busboy.on('finish',() => {
    done()
  })
  req.pipe(busboy)
}
module.exports = formData;

