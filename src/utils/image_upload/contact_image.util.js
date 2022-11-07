import uuid from 'uuid-v4';
import admin from "firebase-admin";
import { bucket } from './product_image.util.js';


const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);



function contactImage(request){
    var contact_images = []
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
        const file_save = bucket.file(`public/uploads/contactImages/${fileName}`);
        file_save.save(imgBuffer, {
            contentType: 'image/jpeg',
            metadata: metadata
        })

        contact_images.push({
            filename: fileName,
            url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${file_save.id}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`
        })

    })
    return contact_images
}

export {contactImage};


