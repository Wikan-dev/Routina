import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client/supabaseClient";

type MenuProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Arahkan ke halaman login setelah logout
  };

  if (!isOpen) return null;
  return (
    <AnimatePresence>
        {isOpen && (
            <>
            <motion.div className="fixed inset-0 flex z-30 bg-black/30 cursor-default" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()} initial={{ x: '-100%'}} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", stiffness: 240, damping: 28 }}>
                    {children}
                    <div className="absolute bottom-4 left-4 right-4">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 font-semibold bg-red-50 hover:bg-red-100 rounded-md"
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    )}
    </AnimatePresence>
  )
}
export default Menu;