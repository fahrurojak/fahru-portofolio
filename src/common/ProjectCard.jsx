import React from 'react';

function ProjectCard({ src, link, h3, p, onClick }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}>
      <img className="hover" src={src} alt={`${h3} logo`} />
      <h3>{h3}</h3>
      <p>{p}</p>
    </a>
  );
}

export default ProjectCard;
