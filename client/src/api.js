import { useEffect, useState } from 'react';

export async function api(path, { signal, ...options } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once:true });
  if (signal?.aborted) controller.abort();
  try {
    const response = await fetch(`/api${path}`, {
      credentials:'same-origin', ...options, signal:controller.signal,
      headers:{ 'Content-Type':'application/json', ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong. Please try again.');
      error.fields = data.errors || {};
      throw error;
    }
    return data;
  } catch(error) {
    if (error.fields) throw error;
    if (signal?.aborted) throw error;
    throw new Error(controller.signal.aborted ? 'The request took too long. Please try again.' : 'Unable to reach DogAdopt. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort',abort);
  }
}

export function useApi(path) {
  const [attempt,setAttempt] = useState(0);
  const [state,setState] = useState({ path:null,loading:true,data:null,error:'' });
  useEffect(()=> {
    if (!path) return;
    const controller = new AbortController();
    setState({path,loading:true,data:null,error:''});
    api(path,{signal:controller.signal}).then(data=>{
      if (!controller.signal.aborted) setState({path,loading:false,data,error:''});
    }).catch(error=>{
      if (!controller.signal.aborted) setState({path,loading:false,data:null,error:error.message});
    });
    return ()=>controller.abort();
  },[path,attempt]);
  return {
    ...(state.path === path ? state : {loading:!!path,data:null,error:''}),
    retry:()=>setAttempt(value=>value+1),
  };
}
