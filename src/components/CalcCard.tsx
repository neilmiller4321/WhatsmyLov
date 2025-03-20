
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type CalcCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  lightColor: string;
  to: string;
  delay?: number;
};

const CalcCard = ({ title, description, icon, color, lightColor, to, delay = 0 }: CalcCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Link
        to={to}
        className="block h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      >
        <div className="p-5 h-full flex flex-col">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: color }}
          >
            <div className="text-white">{icon}</div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm flex-grow">{description}</p>
          
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color }}>
              Try it now
            </span>
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: lightColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color }}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CalcCard;
