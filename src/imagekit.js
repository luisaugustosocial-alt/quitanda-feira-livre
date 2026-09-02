import { auth } from './firebase';

const PUBLIC_KEY = 'public_vwtlqICXUSxwYIQWMKmyE5pmV/Y=';
const URL_ENDPOINT = 'https://ik.imagekit.io/7opliey78';

async function getUploadAuth() {
  const user = auth.currentUser;
  if (!user) throw new Error('Você precisa estar logado como administrador para enviar imagens.');

  const idToken = await user.getIdToken();
  const response = await fetch('/api/imagekit-auth', {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || 'Não foi possível autorizar o envio da imagem.');
  }

  return response.json();
}

async function uploadImage(file, folder) {
  if (!file) return '';
  if (!file.type?.startsWith('image/')) throw new Error('Selecione um arquivo de imagem válido.');

  const { token, signature, expire } = await getUploadAuth();
  const body = new FormData();
  body.append('file', file);
  body.append('fileName', file.name || `imagem-${Date.now()}.jpg`);
  body.append('publicKey', PUBLIC_KEY);
  body.append('token', token);
  body.append('signature', signature);
  body.append('expire', String(expire));
  body.append('useUniqueFileName', 'true');
  body.append('folder', folder);

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || data?.error?.message || 'Não foi possível enviar a imagem ao ImageKit.');

  return data.url || `${URL_ENDPOINT}/${data.filePath || ''}`;
}

export const uploadProductImage = (file) => uploadImage(file, '/quitanda-feira-livre/produtos');
export const uploadSiteImage = (file) => uploadImage(file, '/quitanda-feira-livre/site');

export { PUBLIC_KEY, URL_ENDPOINT };
