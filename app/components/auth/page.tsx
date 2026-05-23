'use client'
import { use, useEffect, useState } from "react"

export const Auth = ()=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [flag, setFlag] = useState(false);
    const [token, setToken] = useState('');


    useEffect(()=>{
        if(flag){
            fetch('http://localhost:8080/auth/login',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        }).then((res)=>res.json()).then((res)=> setToken(res.token));
        }
    },[flag])
    return <div>
        <input type="text" placeholder="Username" onChange={(e)=> setUsername(e.target.value)} value={username}/>
        <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} value={password}/>
        <button onClick={()=>setFlag(!flag)} >Login</button>
        {flag && <h1>{flag}</h1>}
        {
            token && 
                <h1>{token} </h1>
            
        }
    </div>
}