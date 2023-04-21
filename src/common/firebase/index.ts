
import * as admin from 'firebase-admin';
const serviceAccount = require('../../../classifields-a6331-firebase-adminsdk-7s7le-64ddaf8414.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'classifields-a6331.appspot.com'  
});

const uploadBase64MediaToFirebaseStorage = async (base64String: string, mimeType:string, filePathParam : string) => {   

  return new Promise((resolve, reject) => {

  //  const timestamp = new Date().getTime();
  //  const fileName = `${timestamp}_teste.jpeg`;
  //  const filePath = `caminho/para/o/arquivo/${fileName}`;

    const bucket = admin.storage().bucket();

    const file = bucket.file(filePathParam);
    const buffer = Buffer.from(base64String.split(',')[1], 'base64');       
    //aki usa o split poqr vem com data:image/jpeg;base64, do base 64 e no firebase nao aceita com isso  
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType                                               
        //'image/jpeg' // Substitua pelo tipo de arquivo que você está enviando
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
  try{
    const bucket = admin.storage().bucket();

    const file = bucket.file(filePathParam).delete()

    return true
  }catch(err)  {
    if (err.driverError) {
      return err.driverError
    } else {
      return err
    }
  }  
}

export default { 
  uploadBase64MediaToFirebaseStorage, 
  deleteMediaToFirebaseStorage 
};



