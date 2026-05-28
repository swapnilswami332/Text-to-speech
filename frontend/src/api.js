import axios from 'axios';

const api = axios.create({
  baseURL: '',
  timeout: 120000,
});

export async function generateSpeech(text, voiceId = 'adam') {
  // #region agent log
  fetch('http://127.0.0.1:7914/ingest/c24972bc-117e-4aec-af8b-cf4edce83db5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f6b55d'},body:JSON.stringify({sessionId:'f6b55d',hypothesisId:'A',location:'api.js:generateSpeech',message:'request start',data:{voiceId,textLen:text.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  try {
    const response = await api.post('/api/tts/stream', { text, voice_id: voiceId }, {
      responseType: 'blob',
    });
    // #region agent log
    fetch('http://127.0.0.1:7914/ingest/c24972bc-117e-4aec-af8b-cf4edce83db5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f6b55d'},body:JSON.stringify({sessionId:'f6b55d',hypothesisId:'A',location:'api.js:generateSpeech',message:'request success',data:{status:response.status,type:response.data?.type,size:response.data?.size},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
    // #endregion
    return response.data;
  } catch (err) {
    // #region agent log
    fetch('http://127.0.0.1:7914/ingest/c24972bc-117e-4aec-af8b-cf4edce83db5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'f6b55d'},body:JSON.stringify({sessionId:'f6b55d',hypothesisId:'A',location:'api.js:generateSpeech',message:'request failed',data:{status:err?.response?.status,code:err?.code,msg:err?.message},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    throw err;
  }
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
