import crypto from 'node:crypto';

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

async function getFirebaseUser(idToken) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.users?.[0] || null;
}

async function isAdmin(uid, idToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data?.fields?.role?.stringValue === 'admin';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  if (!IMAGEKIT_PRIVATE_KEY) return res.status(500).json({ error: 'ImageKit ainda não foi configurado na Vercel.' });
  if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) return res.status(500).json({ error: 'Firebase não configurado no servidor.' });

  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!idToken) return res.status(401).json({ error: 'Sessão não autorizada.' });

  try {
    const firebaseUser = await getFirebaseUser(idToken);
    if (!firebaseUser?.localId) return res.status(401).json({ error: 'Sessão inválida.' });
    if (!(await isAdmin(firebaseUser.localId, idToken))) return res.status(403).json({ error: 'Somente administradores podem enviar imagens.' });

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 30 * 60;
    const signature = crypto
      .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
      .update(token + expire)
      .digest('hex');

    return res.status(200).json({ token, expire, signature });
  } catch {
    return res.status(500).json({ error: 'Não foi possível gerar a autorização de upload.' });
  }
}
