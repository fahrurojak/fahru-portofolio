import { useState } from 'react';
import './Certificates.css';
import image1 from '../../assets/msib.jpg';
import image2 from '../../assets/dicoding.jpg';
import image3 from '../../assets/dicoding2.jpg';
import image4 from '../../assets/harisenin.jpg';
import image5 from '../../assets/vsga.jpg';
import bnsp1 from '../../assets/bnsp1.jpg';
import bnsp2 from '../../assets/bnsp2.jpg';
import dataAnalytics from '../../assets/Data Analytics.jpg';
import ethicalHacker from '../../assets/Ethical Hacker.jpg';
import { useTheme } from '../../common/ThemeContext';

const certificates = [
  {
    id: 6,
    title: 'BNSP Competency Certificate — Assistant Web Developer',
    description: 'Certified competent in Software Development as an Assistant Web Developer by BNSP through LSP BBPVP Bandung. The certification covers user interface implementation, programming commands, code organization, coding best practices, structured programming, and the use of existing libraries or components. Issued on 6 July 2026 and valid for three years.',
    images: [bnsp1, bnsp2],
  },
  {
    id: 11,
    title: 'Information Technology Specialist — Data Analytics',
    description: 'Successfully completed the certification requirements for Data Analytics and earned the Information Technology Specialist credential from Certiport, a Pearson VUE business. Awarded on 3 August 2025 and valid for five years from the date of issue.',
    image: dataAnalytics,
  },
  {
    id: 12,
    title: 'Cisco Networking Academy — Ethical Hacker',
    description: 'Successfully completed the Ethical Hacker course offered by IT_13Academy through the Cisco Networking Academy program. The course covers ethical hacking concepts and cybersecurity techniques for identifying and understanding system vulnerabilities. Completed on 10 March 2025.',
    image: ethicalHacker,
  },
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
    title: 'Certificate Dicoding',
    description: 'completed the DBS Foundation Coding Camp 2024 Intermediate - Front-End Web Developer course path from Dicoding Indonesia x DBS Bank 2024.',
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
    title: 'Certificate Digitalent',
    description: 'Junior Web Developer is one of the training schemes under the Vocational School Graduate Academy Digital Talent Scholarship 2023 Program, in partnership with Politeknik Negeri Bandung.',
    image: image5,
  },
];

function Certificates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();
  const currentCertificate = certificates[currentIndex];
  const certificateImages = currentCertificate.images || [currentCertificate.image];

  const nextCertificate = () => {
    setCurrentSlide(0);
    setCurrentIndex((prevIndex) =>
      prevIndex === certificates.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCertificate = () => {
    setCurrentSlide(0);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? certificates.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === certificateImages.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? certificateImages.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className={`certificates ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <h2>Certificates</h2>
      <div className={`certificate-card ${theme === 'dark' ? 'dark-mode' : ''}`}>
        <div className="certificate-media">
          <img
            src={certificateImages[currentSlide]}
            alt={`${currentCertificate.title}, page ${currentSlide + 1} of ${certificateImages.length}`}
            className="certificate-image"
          />
          {certificateImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="slide-button slide-button-left"
                aria-label="Previous certificate page"
              >
                &#8249;
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="slide-button slide-button-right"
                aria-label="Next certificate page"
              >
                &#8250;
              </button>
              <span className="slide-count" aria-live="polite">
                {currentSlide + 1} / {certificateImages.length}
              </span>
            </>
          )}
        </div>
        {certificateImages.length > 1 && (
          <div className="slide-dots" aria-label="Certificate pages">
            {certificateImages.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`slide-dot ${currentSlide === index ? 'active' : ''}`}
                aria-label={`Show page ${index + 1}`}
                aria-current={currentSlide === index ? 'true' : undefined}
              />
            ))}
          </div>
        )}
        <h3>{currentCertificate.title}</h3>
        <p>{currentCertificate.description}</p>
      </div>
      <div className="buttons">
        <button type="button" onClick={prevCertificate} aria-label="Previous certificate" className={`arrow-button ${theme === 'dark' ? 'dark-mode' : ''}`}>&lt;</button>
        <span className="certificate-count" aria-live="polite" aria-label={`Certificate ${currentIndex + 1} of ${certificates.length}`}>
          {currentIndex + 1} / {certificates.length}
        </span>
        <button type="button" onClick={nextCertificate} aria-label="Next certificate" className={`arrow-button ${theme === 'dark' ? 'dark-mode' : ''}`}>&gt;</button>
      </div>
    </div>
  );
}

export default Certificates;
