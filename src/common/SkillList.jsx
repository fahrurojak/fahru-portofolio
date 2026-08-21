import { motion } from 'framer-motion';

function SkillList({ src, skill, dragConstraints }) {
  return (
    <motion.span 
      drag 
      dragConstraints={dragConstraints}
      whileDrag={{ scale: 1.1, zIndex: 10, cursor: "grabbing" }}
      whileHover={{ scale: 1.05 }}
      style={{ cursor: 'grab' }}
    >
      <img src={src} alt={`${skill} icon`} loading="lazy" />
      <p>{skill}</p>
    </motion.span>
  );
}

export default SkillList;
