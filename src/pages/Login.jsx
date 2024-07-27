import React from 'react'
import Template from '../components/auth/Template'
function Login() {
    return (
        <div className='bg-[#2a2b33]'>
            <Template title="Welcome Back"
                desc1="Build skills for today, tomorrow, and beyond."
                desc2=" Education to future-proof your career."
                formtype="login"
            />
        </div>
    )
}
export default Login;