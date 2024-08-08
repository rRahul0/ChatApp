import React from 'react'
import Template from '../components/auth/Template'
function Login() {
    return (
        <div className='bg-[#2a2b33]'>
            <Template title="Welcome to NeoChat"
                desc1="Connect, Communicate, and Collaborate with ease."
                desc2="Experience the future of chat ."
                formtype="login"
            />
        </div>
    )
}
export default Login;