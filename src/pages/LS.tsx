import { useState, useEffect } from "react";
import showIcon from "../assets/svg/show.svg";
import hideIcon from "../assets/svg/hide.svg";
import { auth } from "../../backend/firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

export default function LS() {
    const [isShown, setIsShown] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        console.log({ userName, email, password });
    }, [userName, email, password]);

    const handleShow = () => {
        setIsShown(!isShown)
    }

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: userName });
            }
            alert(`Registered: ${userCredential.user.email}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message || "Registration failed");
            } else {
                alert("Registration failed");
            }
        }
    }

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert(`Logged in: ${userCredential.user.email}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message || "Login failed");
            } else {
                alert("Login failed");
            }
        }
    }

    return (
        <div className="flex w-full justify-center h-screen items-center">
            <div className="bg-white border-3 border-gray-200 w-150 flex justify-center p-10 flex-col h-150 ">
                <h1 className="font-bold text-7xl">LOGIN</h1>
                <div className="flex flex-col mb-auto mt-5">
                    <label htmlFor="username">username</label>
                    <input
                        id="username"
                        className="bg-gray-200 p-3 rounded-lg focus:outline-none"
                        type="text"
                        placeholder="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <label htmlFor="email">email</label>
                    <input
                        id="email"
                        className="bg-gray-200 p-3 rounded-lg focus:outline-none"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">password</label>
                    <div id="password" className="mb-auto bg-gray-200 flex items-center p-3 pr-5 rounded-lg focus:outline-none">
                        <input
                            className="flex-1 focus:outline-none"
                            type={isShown ? "text" : "password"}
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <img src={isShown ? hideIcon : showIcon} onClick={handleShow} alt="show" className="w-6 h-6 cursor-pointer" />
                    </div>
                </div>
                <div className="flex mt-4 gap-5">
                    <button onClick={handleRegister} className="ml-auto bg-white border w-30 h-10 rounded-md font-bold">REGISTER</button>
                    <button onClick={handleLogin} className=" bg-white border w-30 h-10 rounded-md font-bold text-blue-500">LOGIN</button>
                </div>
            </div>
        </div>
    )
}