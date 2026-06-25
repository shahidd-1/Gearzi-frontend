import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      // Starts slightly invisible and 20px higher up
      initial={{ opacity: 0, y: -20 }} 
      // Flows down to its normal position and becomes fully visible
      animate={{ opacity: 1, y: 0 }}   
      // When leaving, it fades out and slides down slightly
      exit={{ opacity: 0, y: 20 }}     
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-grow flex flex-col w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;