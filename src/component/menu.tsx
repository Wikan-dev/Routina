import React from "react"
import { motion, AnimatePresence } from "motion/react";

type MenuProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
        {isOpen && (
            <>
            <motion.div className="fixed inset-0 flex z-30 bg-black/30 cursor-default" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()} initial={{ x: '-100%'}} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", stiffness: 240, damping: 28 }}>{children}</motion.div>
            </motion.div>
        </>
    )}
    </AnimatePresence>
  )
}
export default Menu;