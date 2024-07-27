import { useSelector } from "react-redux"

import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import Loader from "../common/Loader"

function Template({ title, desc1, desc2, formtype }) {
  const { loading } = useSelector((state) => state.auth)

  return (
      <div className="h-screen flex items-center text-white">
        {loading ? (
          <Loader />
        ) : (
          <div className="mx-auto flex max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12 items-center rounded-2xl bg-[#181a20] shadow-xl shadow-slate-600 ">

            <div className="px-10 max-w-[450px] md:mx-0 flex flex-col items-center ">
              <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] ">
                {title}
              </h1>
              <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
                <span className="text-slate-50">{desc1}</span>{" "}
                <span className="font-edu-sa font-bold italic text-blue-100">
                  {desc2}
                </span>
              </p>
              {formtype === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
          </div>
        )}
      </div>

  )
}

export default Template