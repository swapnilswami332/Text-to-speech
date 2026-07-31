import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 120000,
});

export async function generateSpeech(text, voiceId = 'adam') {
  const response = await api.post('/api/tts/stream', { text, voice_id: voiceId }, {
    responseType: 'blob',
  });
  return response.data;
}

export async function extractPdf(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/extract-pdf', formData);
  return response.data;
}

export async function healthCheck() {
  const response = await api.get('/api/health');
  return response.data;
}
