import uuid from 'uuid-v4';
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "customer-portal-kaispe.appspot.com"
});
var bucket = admin.storage().bucket();



function productImage(request){
    var product_images = []
    request.files.map(function(file){
        const metadata = {
            metadata: {
              firebaseStorageDownloadTokens: uuid()
            },
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000',
          };
        const fileName = `${Date.now()}_${file.fieldname}_${file.originalname}`
        var imgBuffer = new Buffer.from(file.buffer, 'base64')
        const file_save = bucket.file(`public/uploads/productImages/${fileName}`);
        file_save.save(imgBuffer, {
            contentType: 'image/jpeg',
            metadata: metadata
        })

        product_images.push({
            filename: fileName,
            url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${file_save.id}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`
        })

    })
    return product_images
}

export {productImage, bucket};


