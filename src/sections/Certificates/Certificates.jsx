import React, { useState } from 'react';
import './Certificates.css';
import image1 from '../../assets/msib.jpg';
import image2 from '../../assets/dicoding.jpg';
import image3 from '../../assets/msib.jpg';
import image4 from '../../assets/harisenin.jpg';
import image5 from '../../assets/msib.jpg';
import image6 from '../../assets/msib.jpg';
import image7 from '../../assets/msib.jpg';
import image8 from '../../assets/msib.jpg';
import image9 from '../../assets/msib.jpg';
import image10 from '../../assets/msib.jpg';
import { useTheme } from '../../common/ThemeContext';

const certificates = [
  {
    id: 1,
    title: 'Certificate MBKM',
    description: 'As part of the Studi Independen — Kampus Merdeka program by the Ministry of Education, the RevoU Tech Academy offers a comprehensive curriculum covering Data Analytics and Software Engineering.',
    image: image1,
  },
  {
    id: 2,
    title: 'Certificate Dicoding',
    description: 'completed the DBS Foundation Coding Camp 2024 Beginner - Front-End Web Developer course path from Dicoding Indonesia x DBS Bank 2024.',
    image: image2,
  },
  {
    id: 3,
    title: 'Certificate 3',
    description: 'Description 3',
    image: image3,
  },
  {
    id: 4,
    title: 'Certificate Harisenin',
    description: 'Completed a 3-week bootcamp, gaining hands-on experience in front-end and back-end development. Developed a web application using HTML, JavaScript, and Tailwind CSS, enhancing my web technology skills.',
    image: image4,
  },
  {
    id: 5,
    title: 'Certificate 5',
    description: 'Description 5',
    image: image5,
  },
  {
    id: 6,
    title: 'Certificate 6',
    description: 'Description 6',
    image: image6,
  },
  {
    id: 7,
    title: 'Certificate 7',
    description: 'Description 7',
    image: image7,
  },
  {
    id: 8,
    title: 'Certificate 8',
    description: 'Description 8',
    image: image8,
  },
  {
    id: 9,
    title: 'Certificate 9',
    description: 'Description 9',
    image: image9,
  },
  {
    id: 10,
    title: 'Certificate 10',
    description: 'Description 10',
    image: image10,
  },
];

function Certificates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();

  const nextCertificate = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === certificates.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCertificate = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? certificates.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={`certificates ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <h2>Certificates</h2>
      <div className={`certificate-card ${theme === 'dark' ? 'dark-mode' : ''}`}>
        <img
          src={certificates[currentIndex].image}
          alt={certificates[currentIndex].title}
          className="certificate-image"
        />
        <h3>{certificates[currentIndex].title}</h3>
        <p>{certificates[currentIndex].description}</p>
      </div>
      <div className="buttons">
        <button onClick={prevCertificate} className={`arrow-button ${theme === 'dark' ? 'dark-mode' : ''}`}>&lt;</button>
        <button onClick={nextCertificate} className={`arrow-button ${theme === 'dark' ? 'dark-mode' : ''}`}>&gt;</button>
      </div>
    </div>
  );
}

export default Certificates;
