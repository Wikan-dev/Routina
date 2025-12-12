import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type MenuProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Menus: React.FC<MenuProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
        {isOpen && (
            <>
            <motion.div className="fixed inset-0 flex z-30 bg-black/30 cursor-default" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white w-64 h-full p-4 bg-white dark:bg-gray-900 text-black dark:text-white" onClick={(e) => e.stopPropagation()} initial={{ x: '-100%'}} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", stiffness: 240, damping: 28 }}>
                    {children}
                    <div className="absolute bottom-4 left-4 right-4">
                    </div>
                </motion.div>
            </motion.div>
        </>
    )}
    </AnimatePresence>
  )
}
export default Menus;