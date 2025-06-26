import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  type: "service_account",
  projectId: "keysystem-d0b86",
  privateKeyId: "663ba90c8c64a8b752e88b1a52319414ea23f576",
  privateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXLVuzIv0U7T56\ngEIOm8svo3oYhTlCNJGxebvGTOm18fWU0IORpbWKe1WzhCqnAeIEzwPUYXbBVtWf\nfJ7jrpP2tn5tzcCSJyLIJ6CVVL+nSy0FSfxgIqoaVDeOgBDDb+ZTc/QuDhGt2m/g\nEu7DHWH9VZ+MXLJS6WlG+S1IMwCc7AKPZAkMpZEIEUdHNXD5kqNA32TcQ93Vdqqu\nKbxh7dBpqYP7h9wcMXwNVH09Zh+9edNk+k5pRh7ZV6MYx8HyasGy+YMeobycTR3a\nCAm7DZrFcnVVi5WD864jZKC/mMBdhM4b1aES/qEnwgJLRfmAs8oBs1KIqMC1r2WV\nCorLZNJtAgMBAAECggEAAKrmAipMyc0RmI+wB8mvIc+4y025s5qKn8KbQXeER+LN\ncQT9GViM+6z3WbdjGAez5gEjODER/PqTYoS1wujTcgrbD6sRhzoX0KB0K64+Uzb+\nxOY1vUrwS1t4P1XYPRsYyxRZALCpNuy4nIzlpwQeZnSWI5PvnNqENeVsMMRtsHbm\nMnITybjzEpvAUyL8uhnCWnlskxuYFjPjMGPPuS3SrFGx8ZXb8jK/JHdU3P6ihj0v\nPHUNWZEfTTvvu2BeVf/c7VQFarCGg9kfwU7jpm/Z54HQwMVuScqLyel/nDODXtqO\n4BruyveaEloC9f7QNm408MpUd4nZ+4/1wEYxzAwwNQKBgQDQlwlZaXK9M8ke50hz\noCJ7FLBzGOGpOnsmLGU8qVKBv+5Dfmm1ytLP2OJVFH1Qa2G46L6pSMGZiY+44dgH\nXxi8NAeGUx5hup5gIxwicUEsfAbIpf8QIb54yKxB1wwknzo/ht8pc7fN7tey/YNe\n1kidwI1k+gnTHq2HerVivg+4MwKBgQC5ibcB54tKZr+i5qNV6E+7sT7S3OMu8mcX\nR7z321R+e2g4z2HK+j6Gr95+NQeqR49Hj/g7qs20O8FmIlM77kHPXehOQZGBHoH6\nXmxh9SRpMW5GcGdQ0dAHezIorvEfZj/T4K0i95A2KRiQDK1d8bMG7WdWO11cgUwS\nngHxK5kq3wKBgHsdyrzlin22RS1iYdctW2y+R2+H7hnOlMVxSsfFQReoS1+3C3nr\nnwZjAyQoldaTqvhTF8YfVXXkRdpgIvwm2xiqtQ5JnRMd7UDdOEv0AP3arr5bi/Lf\nl+b+uv2ZimdLPDwmxS1YSdLY+KODErk1TWMfNdW153qfDtl6SflgKTMVAoGABXMj\nGf44HC5acKl/oLVbKjMxmjX8wlNCbe+ggFND7xcm34xP3gttrL0btu9N01WYwsxa\nyT3iHuomax6U/UypSDME8M+CO52uybDeVB5EPIbEK3N/xWL0TlPzDDjfQkHZnBqc\nW0uUQ9L/MrP8n6bK0GhGwcSqoF334xAbFH9oV1cCgYEAnU+IfgXaZsR9vHtxrbCR\n9UoIc7L9risgWFDVEofwL/qkisNbJkAO/V69b5CS2pvj3uhwhSxV2TdiF2oeLvby\nB3IDTLwH9E/MJuEKO0V8kI9DgkBdBxhiLVO6Iwd8i9XVcWpNcbhCcT1bte+CRqG8\nNxJGcegxZgCm9toLODNTgxI=\n-----END PRIVATE KEY-----\n",
  clientEmail:
    "firebase-adminsdk-fbsvc@keysystem-d0b86.iam.gserviceaccount.com",
  clientId: "103545005750398754258",
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
  clientX509CertUrl:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40keysystem-d0b86.iam.gserviceaccount.com",
  universeDomain: "googleapis.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
