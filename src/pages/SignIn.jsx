import React, { useState } from "react";
import { authClient } from "../lib/client-auth";
import {Button} from "../components/ui/button";
function SignIn() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
     const result = await authClient.signIn.email({
        
        email: email,
        password: password
      
    });
    

    console.log("Sign up successful:", result);
    
  } catch (error) {
    
    console.error("Sign up error:", error);
  }

  }

  return (
    <>
      <form className="flex flex-col gap-4 w-1/3 mx-auto mt-10" onSubmit={handleSubmit}>
      
        <input
          className="border border-gray-300 p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          type="submit"
            
        >
          Sign In
        </Button>
      </form>
    </>
  );
}

export default SignIn;
