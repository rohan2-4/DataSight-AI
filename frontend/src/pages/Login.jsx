import { useState } from 'react';
function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    function handleSubmit(e){
        e.preventDefault();
        if(email === "" || password === ""){
            setError("Please fill in all fields");
            return;
        }
        if(!email.includes("@")){
            setError("Please enter a valid email address");
            return;
        }
        setError("");
        console.log('Email:', email);
        console.log('Password:', password);
    }   
    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form onSubmit={handleSubmit}
             className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Login
            </h1>
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded mb-4"
                />
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-3 rounded mb-6"
                />
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mb-4 text-blue-600 "
                >
                {showPassword ? "Hide Password" : "Show Password"}
            </button>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                >
                Login
            </button>
            </form>
        </div>
    )
}
export default Login;
