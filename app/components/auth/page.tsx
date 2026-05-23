'use client'
import { use, useEffect, useState } from "react"

export const Auth = ()=>{
    const [flag, setFlag] = useState(true);
    return <div>
        {flag ? <LoginPage /> : <SignUpPage /> }
        <button onClick={()=>setFlag(!flag)}>sign up</button>
    </div>
}

const LoginPage = ()=>{
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
        if(token){
            localStorage.setItem("jwtToken", token);
        }
    },[flag])
    return <div>
        <h3>Login</h3>
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

const SignUpPage = ()=>{
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [about, setAbout] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [flag, setFlag] = useState(false);
    const [token, setToken] = useState('');


    useEffect(()=>{
        if(flag){
            fetch('http://localhost:8080/auth/signup',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                about: about,
                phone: phone,
                password: password
            })
        }).catch(()=>console.log("Exception occured while placing sign up request."));
        }
    },[flag])
    return <div>
        <h3>Sign Up</h3>
        <input type="text" placeholder="Full Name" onChange={(e)=> setFullName(e.target.value)} value={fullName}/>
        <input type="text" placeholder="Email" onChange={(e)=> setEmail(e.target.value)} value={email}/>
        <input type="text" placeholder="About" onChange={(e)=> setAbout(e.target.value)} value={about}/>
        <input type="text" placeholder="Mobile Number" onChange={(e)=> setPhone(e.target.value)} value={phone}/>
        <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} value={password}/>
        <button onClick={()=>setFlag(!flag)} >Sign Up</button>
        {flag && <h1>{flag}</h1>}
        {
            token && 
                <h1>{token} </h1>
            
        }
        {password && <h1>{password}</h1>}
    </div>
}