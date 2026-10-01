import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
const Context = createContext(null);
export function AuthProvider({children}) {
  const [user,setUser] = useState(null);
  useEffect(()=> {
    const controller = new AbortController();
    api('/auth/me',{signal:controller.signal}).then(data=>{
      if(!controller.signal.aborted) setUser(data.user);
    }).catch(()=>{});
    return ()=>controller.abort();
  },[]);
  return <Context.Provider value={{user,setUser}}>{children}</Context.Provider>;
}
export const useAuth = ()=>useContext(Context);
