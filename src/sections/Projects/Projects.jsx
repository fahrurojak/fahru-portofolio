import React, { useState } from 'react';
import styles from './ProjectsStyles.module.css';
import freshgo from '../../assets/FreshGO.png';
import property from '../../assets/property.png';
import book from '../../assets/book.png';
import minds from '../../assets/minds.png';
import triftingan from '../../assets/triftingan.png';
import kimiafarma from '../../assets/kimiafarma-apotek.png';
import ptdi from '../../assets/portal-dittek.png';
import kateringgo from '../../assets/kateringgo.png';
import ProjectCard from '../../common/ProjectCard';
import notes from '../../assets/notes.png';
import ProjectModal from '../../common/ProjectModal/ProjectModal';
import { SiReact, SiVite, SiTailwindcss, SiNodedotjs, SiNextdotjs, SiExpress, SiLooker, SiGoogle, SiBootstrap } from 'react-icons/si';

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projectsData = [
    { src: freshgo, link: "https://fresh-go-fahrurojaks-projects.vercel.app/", h3: "FreshGO", p: "Aplikasi e-commerce modern khusus belanja buah dan sayuran segar langsung dari petani lokal dengan pengiriman instan.", images: [freshgo], techStack: [<SiReact color="#61DAFB" />, <SiVite color="#646CFF" />, <SiTailwindcss color="#06B6D4" />] },
    { src: book, link: "https://book-shelf-fahrurojaks-projects.vercel.app/", h3: "Bookshelf", p: "Platform manajemen perpustakaan pribadi untuk melacak riwayat bacaan, memberikan ulasan, dan ulasan buku.", images: [book], techStack: [<SiReact color="#61DAFB" />, <SiNodedotjs color="#339933" />] },
    { src: triftingan, link: "https://triftingan.vercel.app/", h3: "Triftingan", p: "Marketplace barang preloved berkualitas. Temukan gaya fashion unik sambil mendukung gaya hidup ramah lingkungan.", images: [triftingan], techStack: [<SiNextdotjs />, <SiTailwindcss color="#06B6D4" />] },
    { src: minds, link: "https://minds-fahrurojaks-projects.vercel.app/", h3: "Minds", p: "Aplikasi kesehatan mental dengan fitur jurnal harian, meditasi terbimbing, dan pelacakan mood.", images: [minds], techStack: [<SiReact color="#61DAFB" />, <SiTailwindcss color="#06B6D4" />] },
    { src: kateringgo, link: "https://katering-go.vercel.app/", h3: "KateringGO", p: "Sistem pemesanan katering pintar untuk acara kantoran dan keluarga dengan pilihan menu fleksibel.", images: [kateringgo], techStack: [<SiReact color="#61DAFB" />, <SiExpress />] },
    { src: kimiafarma, link: "https://kfacenter.vercel.app/", h3: "Kimia Farma Center", p: "Sistem pendukung aktivitas operasional TI (KFA Center) melalui pengelolaan insiden, inventaris aset, jadwal maintenance, dan dashboard monitoring.", images: [kimiafarma], techStack: [<SiReact color="#61DAFB" />, <SiVite color="#646CFF" />, <SiTailwindcss color="#06B6D4" />, <SiNodedotjs color="#339933" />] },
    { src: ptdi, link: "https://portal-dittek.vercel.app/", h3: "Portal Dittek", p: "Sistem portal direktorat teknologi PT Dirgantara Indonesia.", images: [ptdi], techStack: [<SiReact color="#61DAFB" />, <SiBootstrap color="#7952B3" />] },
    { src: property, link: "https://lookerstudio.google.com/reporting/611c3feb-aaea-4d6a-a843-836f731595e2/page/LQ2jD", h3: "Newyork Sales Property", p: "Dashboard visualisasi data interaktif menggunakan Looker Studio untuk analisis tren properti di New York.", images: [property], techStack: [<SiLooker color="#4285F4" />, <SiGoogle color="#4285F4" />] },
    { src: notes, link: "https://notes-app-fahrurojaks-projects.vercel.app/", h3: "Notes App", p: "Aplikasi catatan produktivitas super bersih yang mendukung sinkronisasi cepat dan pengkategorian cerdas.", images: [notes], techStack: [<SiReact color="#61DAFB" />, <SiVite color="#646CFF" />] }
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
