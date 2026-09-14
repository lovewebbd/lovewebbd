import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const raw = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(raw);
const storage = getStorage(app);
const testRef = ref(storage, 'test.txt');
try {
  await uploadBytes(testRef, new Uint8Array([104, 101, 108, 108, 111]));
  const url = await getDownloadURL(testRef);
  console.log('Success:', url);
} catch (e) {
  console.error('Error:', e);
}
