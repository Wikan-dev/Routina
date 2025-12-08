import { motion } from "framer-motion";

export default function Start() {
    return (
        <div className="bg-white w-full h-screen overflow-hidden">
            <motion.div className="bg-blue-500 w-1000 h-900 rounded-full absolute top-20"   >
                <h1 className="text-white">Start</h1>
            </motion.div>
        </div>
    )
}