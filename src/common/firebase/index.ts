
import * as admin from 'firebase-admin';
import { CreatePushNotificationDto } from 'src/firebase-push-and-device-register/dto/create-push-notification.dto';

let serviceAccount = null
serviceAccount = require('../../../classifields-a6331-firebase-adminsdk-7s7le-64ddaf8414.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'classifields-a6331.appspot.com'
});

const uploadBase64MediaToFirebaseStorage = async (base64String: string, mimeType: string, filePathParam: string) => {

  return new Promise((resolve, reject) => {

    const bucket = admin.storage().bucket();

    const file = bucket.file(filePathParam);
    const buffer = Buffer.from(base64String.split(',')[1], 'base64');

    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType
      }
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('finish', () => {
      file.getSignedUrl({
        action: 'read',
        expires: '03-17-3023'                                               // Substitua pela data de expiração da URL
      }).then((url) => {
        resolve(url[0]);
      }).catch((err) => {
        reject(err);
      });
    });

    stream.end(buffer);
  });
}

const deleteMediaToFirebaseStorage = async (filePathParam: string) => {
  try {
    const bucket = admin.storage().bucket();

    const file = bucket.file(filePathParam).delete()

    return true
  } catch (err) {
    if (err.driverError) {
      return err.driverError
    } else {
      return err
    }
  }
}

const postPushNotification = (data: CreatePushNotificationDto) => {  

  //metodo antigo cause nao mande nenhum token envia para todos usuarios
  // return admin
  //   .messaging()
  //   .sendToDevice(
  //     data.tokens,
  //     {
  //       notification: {
  //         title: data.notification.title,
  //         body: data.notification.body,
  //         icon: data.notification.imageUrl
  //       },
  //       data: { } }
  //   )

    return admin.messaging().sendEachForMulticast({
      tokens: data.tokens,
      notification: data.notification,     
      data: data.data,
    })
    .then((response) => {
      console.log(response, 1111)
      return response
    })
    .catch((error) => {
      console.log(error, 222);
      return error
    });
 
};

export default {
  uploadBase64MediaToFirebaseStorage,
  deleteMediaToFirebaseStorage,
  postPushNotification
};



