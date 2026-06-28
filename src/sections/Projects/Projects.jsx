import React, { useState } from 'react';
import styles from './ProjectsStyles.module.css';
import freshgo from '../../assets/FreshGO.png';
import property from '../../assets/property.png';
import book from '../../assets/book.png';
import minds from '../../assets/minds.png';
import triftingan from '../../assets/triftingan.png';
import kimiafarma from '../../assets/kimiafarma.png';

import kateringgo from '../../assets/kateringgo.png';
import ProjectCard from '../../common/ProjectCard';
import notes from '../../assets/notes.png';
import ProjectModal from '../../common/ProjectModal/ProjectModal';

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projectsData = [
    { src: freshgo, link: "https://fresh-go-fahrurojaks-projects.vercel.app/", h3: "FreshGO", p: "Aplikasi e-commerce modern khusus belanja buah dan sayuran segar langsung dari petani lokal dengan pengiriman instan.", images: [freshgo] },
    { src: book, link: "https://book-shelf-fahrurojaks-projects.vercel.app/", h3: "Bookshelf", p: "Platform manajemen perpustakaan pribadi untuk melacak riwayat bacaan, memberikan ulasan, dan ulasan buku.", images: [book] },
    { src: triftingan, link: "https://triftingan.vercel.app/", h3: "Triftingan", p: "Marketplace barang preloved berkualitas. Temukan gaya fashion unik sambil mendukung gaya hidup ramah lingkungan.", images: [triftingan] },
    { src: minds, link: "https://minds-fahrurojaks-projects.vercel.app/", h3: "Minds", p: "Aplikasi kesehatan mental dengan fitur jurnal harian, meditasi terbimbing, dan pelacakan mood.", images: [minds] },
    { src: kateringgo, link: "https://katering-go.vercel.app/", h3: "KateringGO", p: "Sistem pemesanan katering pintar untuk acara kantoran dan keluarga dengan pilihan menu fleksibel.", images: [kateringgo] },
    { src: kimiafarma, link: "https://kfacenter.vercel.app/", h3: "Kimia Farma Center", p: "Sistem pendukung aktivitas operasional TI (KFA Center) melalui pengelolaan insiden, inventaris aset, jadwal maintenance, dan dashboard monitoring.", images: [kimiafarma] },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/22/Indonesian_Aerospace_logo.png", link: "https://portal-dittek.vercel.app/", h3: "Portal Dittek", p: "Sistem portal direktorat teknologi PT Dirgantara Indonesia.", images: ["https://upload.wikimedia.org/wikipedia/commons/2/22/Indonesian_Aerospace_logo.png"] },
    { src: property, link: "https://lookerstudio.google.com/reporting/611c3feb-aaea-4d6a-a843-836f731595e2/page/LQ2jD", h3: "Newyork Sales Property", p: "Dashboard visualisasi data interaktif menggunakan Looker Studio untuk analisis tren properti di New York.", images: [property] },
    { src: notes, link: "https://notes-app-fahrurojaks-projects.vercel.app/", h3: "Notes App", p: "Aplikasi catatan produktivitas super bersih yang mendukung sinkronisasi cepat dan pengkategorian cerdas.", images: [notes] }
  ];

  return (
    <>
      <section id="projects" className={`glass-panel ${styles.container}`}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectsContainer}>
        {projectsData.map((project, index) => (
          <ProjectCard
            key={index}
            src={project.src}
            link={project.link}
            h3={project.h3}
            p={project.p}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>
      </section>
      
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </>
  );
}

export default Projects;
