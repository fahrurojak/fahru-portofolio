import { useState } from 'react';
import styles from './ProjectsStyles.module.css';
import { useLanguage } from '../../common/LanguageContext';
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
import { MdViewList, MdGridView, MdSearch, MdClose } from 'react-icons/md';

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { t } = useLanguage();
  const items = t('projects.items');

  const categories = ['All', 'React', 'Next.js', 'Node.js', 'Tailwind', 'Data'];

  const projectsData = [
    { src: freshgo, link: "https://fresh-go-fahrurojaks-projects.vercel.app/", h3: items[0].title, p: items[0].p, images: [freshgo], techStack: [<SiReact key="react" color="#61DAFB" />, <SiVite key="vite" color="#646CFF" />, <SiTailwindcss key="tw" color="#06B6D4" />], tags: ['React', 'Tailwind'] },
    { src: book, link: "https://book-shelf-fahrurojaks-projects.vercel.app/", h3: items[1].title, p: items[1].p, images: [book], techStack: [<SiReact key="react" color="#61DAFB" />, <SiNodedotjs key="node" color="#339933" />], tags: ['React', 'Node.js'] },
    { src: triftingan, link: "https://triftingan.vercel.app/", h3: items[2].title, p: items[2].p, images: [triftingan], techStack: [<SiNextdotjs key="next" />, <SiTailwindcss key="tw" color="#06B6D4" />], tags: ['Next.js', 'Tailwind'] },
    { src: minds, link: "https://minds-fahrurojaks-projects.vercel.app/", h3: items[3].title, p: items[3].p, images: [minds], techStack: [<SiReact key="react" color="#61DAFB" />, <SiTailwindcss key="tw" color="#06B6D4" />], tags: ['React', 'Tailwind'] },
    { src: kateringgo, link: "https://katering-go.vercel.app/", h3: items[4].title, p: items[4].p, images: [kateringgo], techStack: [<SiReact key="react" color="#61DAFB" />, <SiExpress key="express" />], tags: ['React', 'Node.js'] },
    { src: kimiafarma, link: "https://kfacenter.vercel.app/", h3: items[5].title, p: items[5].p, images: [kimiafarma], techStack: [<SiReact key="react" color="#61DAFB" />, <SiVite key="vite" color="#646CFF" />, <SiTailwindcss key="tw" color="#06B6D4" />, <SiNodedotjs key="node" color="#339933" />], tags: ['React', 'Node.js', 'Tailwind'] },
    { src: ptdi, link: "https://portal-dittek.vercel.app/", h3: items[6].title, p: items[6].p, images: [ptdi], techStack: [<SiReact key="react" color="#61DAFB" />, <SiBootstrap key="bs" color="#7952B3" />], tags: ['React'] },
    { src: property, link: "https://lookerstudio.google.com/reporting/611c3feb-aaea-4d6a-a843-836f731595e2/page/LQ2jD", h3: items[7].title, p: items[7].p, images: [property], techStack: [<SiLooker key="looker" color="#4285F4" />, <SiGoogle key="google" color="#4285F4" />], tags: ['Data'] },
    { src: notes, link: "https://notes-app-fahrurojaks-projects.vercel.app/", h3: items[8].title, p: items[8].p, images: [notes], techStack: [<SiReact key="react" color="#61DAFB" />, <SiVite key="vite" color="#646CFF" />], tags: ['React'] }
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesSearch = project.h3.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.p.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <section id="projects" className={`glass-panel ${styles.container}`}>
        <div className={styles.header}>
          <h1 className="sectionTitle" style={{ marginBottom: 0 }}>{t('projects.title')}</h1>
          <div className={styles.controlsGroup}>
            <div className={`${styles.searchBar} ${searchQuery ? styles.searchActive : ''}`}>
              <MdSearch size={20} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder={t('projects.searchPlaceholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className={styles.clearBtn}
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <MdClose size={18} />
                </button>
              )}
            </div>
            <div className={styles.filterGroup}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilter : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All' ? t('projects.all') : cat}
                </button>
              ))}
            </div>
            <div className={styles.toggleGroup}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeMode : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <MdViewList size={24} />
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeMode : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <MdGridView size={24} />
            </button>
          </div>
        </div>
      </div>
        
      <div className={`${styles.projectsContainer} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                src={project.src}
                link={project.link}
                h3={project.h3}
                p={project.p}
                onClick={() => setSelectedProject(project)}
              />
            ))
          ) : (
            <p className={styles.noResults}>{t('projects.noResults')} &quot;{searchQuery}&quot;</p>
          )}
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
