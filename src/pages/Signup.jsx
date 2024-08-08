import Template from "../components/auth/Template";


const Signup = () => {
  return (
    <div className='bg-[#2a2b33]'>
      <Template title="Join NeoChat"
        desc1="Start your journey with us today."
        desc2="Sign up to unlock innovative chatting."
        formtype="signup"
      />

    </div>
  );
}

export default Signup;