import axios from "axios";
import cancel from "../assets/icon/X.svg";
import { useState } from "react";
import { supabase } from "../client/supabaseClient";

interface ChangeNameProps {
    setChangeNameState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangeName( {setChangeNameState}: ChangeNameProps ) {
    const [newName, setNewName] = useState("");

    const handleChangeName  = async () => {
        const new_name = newName;

        if (!new_name) {
            alert("Name harus diisi")
            return
        }

        try {
            // Get user from Supabase first
            const { data: { user } } = await supabase.auth.getUser();
            const user_id = user?.id;

            if (!user_id) {
                alert("User tidak ditemukan, silahkan login ulang");
                return;
            }

            const res = await axios.put("http://localhost:4000/changeName", {
                user_id: user_id,
                new_name: new_name,
            });
            alert(res.data.message);

            // Update localStorage
            const storedProfile = localStorage.getItem("user_profile");
            if (storedProfile) {
                const profile = JSON.parse(storedProfile);
                profile.name = new_name;
                localStorage.setItem("user_profile", JSON.stringify(profile));
            }

            setChangeNameState(false); // Close modal on success
        } catch (err: any) {
            console.error(err);
            if (err.response) {
                alert(`Error: ${err.response.data.error}`);
            } else {
                alert("Terjadi kesalahan saat mengganti nama.");
            }
        }
    }
    return (
        <div className="w-full flex justify-center items-center bg-black/30 absolute z-50 left-0 h-screen">
            <div className="w-[90%] lg:max-w-170 lg:min-h-150 h-[50%] min-h-80 bg-white rounded-xl flex justify-center p-5 flex-col relative">
            <img src={cancel} onClick={() => setChangeNameState(false)} alt="cancel" className="p-5 absolute top-0 right-0" />
                <div className="w-20 h-20 lg:w-30 lg:h-30 bg-gray-400 rounded-full mx-auto"></div>
                <div className="mb-auto">
                    <h1 className="mt-5">Change Name</h1>
                    <input onChange={(e) => setNewName(e.target.value)} type="text" className="bg-white mb-auto mt-2 w-full h-10 rounded-xl border-4 pl-5 border-[#DFDFDF]" placeholder="input your name" />
                </div>

                <button onClick={handleChangeName} className="bg-white border-4 border-[#DFDFDF] rounded-xl h-10 w-30 ml-auto">Confirm</button>
            </div>
        </div>
    )
}