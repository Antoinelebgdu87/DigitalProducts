import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  type: "service_account",
  projectId: "keysystem-d0b86",
  privateKeyId: "18546401b4d56292a3ed58f4f3d1f8c36968ab0d",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0I/CbeAWWA69G\n/pCHDkn/+f5mAlkh1uolx0RP9I3IQv6iNX9NB+KyraQ/aNR+Gi/s0ywiEqZrwa8f\nWNteeLfAC/eGo0V7i0Vp4mHvfjhFRS8d0kE5kU3vhL881lExvFokHhcfdESSqIN+\n0URqAP9nEf7Df8PS/6rtgUrUVxVNmH+IV5xZZSZI8RZhJSsO72m1ts26H74vKJkA\nwa9jD7p4HVkfZr3uPpb9aSKYdFsfATdFeZ8dLZwf1vGJbuN+lvd1n2G1YWSKroqJ\ne+Lefps2yl6E++nxnCwkwKxXvQ/oxQAiIk66KD/haauawFQdmmxV9svtpXVDDOlQ\nHaSYc1d5AgMBAAECggEAEhHKVm/6QHdfZzvNB80YQWnkWbtp0S4Hh/FWcf4+FBzb\nQa5j1fhg5isqjvU/HmSWUtdGZacRBD1WCYsOWyo5BVW19y6Mv1Ujqfi8OeujbZhg\nXumKoyGHC6v5SlsVoytpb9bIWz58i+kFIq0PY6I0vFQm5dmcrR85+C+4T7cqAwHK\nS1LNiPykDy4XST11odu8R3KO8VdUdF7N6zzsZhFCXzf1VPyjeg37sbDOfnhQ5JNW\nj6sDQa5/+cFEbp+mAXFnoEWEesGf0UrDoTbWF6dwivt/uNBJho5Ab/NdO3r7fVSa\nzHaMx6cwjYdao5D5XFxdBAslFQQ9VvQD9hoWtKfH8QKBgQDd0uqjPCtYsB5tpWfr\n+yQiQdvjVnVBpEtYUooO5xJNYX2JhONC83sX2ClsEcotZ37QSYKk+rXn4qx4qwUC\n23knzoUuMir65foGZjF8SpJwuyijq06pEba8adR3h5kHtOCNorFfz+yKqXOO367/\nEh9h5LYqFkyGf76lSCV0dDDRKQKBgQDP5PXa3ogyTFv3E6GuL55QsHXK02tAqoiU\n2OJpW33VvvUwepZPbhKSx7XJqj2nCkHOhqYmpwQpbM6Pylm2JdpqFwafgfFhU+C2\nqn0qDrNbQYiTOq5V4BXDhoiuzhQEr4yRzfgBAp8yXWmh0Da0bNdwvyjS8NjFNEq6\n75+4Id2N0QKBgQCFPvfw++ixyoFMrcoCB4bKCTOTmNCwkIct087YatckokYtgCSf\nh/BN/2vKXdlLctrLNQ0EGxF/7Dpb9ab582oQjk6T1FDbC6AnjeV12rmie9pKjlGe\n32QcQ5n7/vjelzk3+x1/Bz/4fxdKIHVXBMTTIfaGy4RGWp/jWrYdANp+GQKBgQCZ\nBN/pf44j54xxaiPBQA95OMkax07URDFPzeuovMz8PRff3Psx78UAALtPelzyzFvv\nlbBKFvi7PPk1YS1zIp2HJPedBFoU11Y5XXfPMw7VBoFuTOzxDIU4a5fDgq+9WzFO\nSJpYtANVYOhVUBpT5yEUPb/gs6H6VSkEO0gGkfavYQKBgEubqDqLwECDc25mKf4Z\nM5Q07OtVVEWtVCOk5+vMAprdfvlVKexCHm6ugoWMtP0K/1PyVyMrbX9O3mFSEwZd\nrpmCm+4d9KhHDtkTFmlgjOFHTNboFDNyiKywm+KBSjaPty6pq2kbeGwSMgS2bfZg\n5gPQVhoK0jiGrZiBbLPyuUU/\n-----END PRIVATE KEY-----\n",
  clientEmail: "firebase-adminsdk-fbsvc@keysystem-d0b86.iam.gserviceaccount.com",
  clientId: "101004181817928993145",
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
  clientX509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40keysystem-d0b86.iam.gserviceaccount.com",
  universeDomain: "googleapis.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
