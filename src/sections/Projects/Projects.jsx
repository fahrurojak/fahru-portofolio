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
import bankSampah from '../../assets/banksampah.png';
import inventoryManagement from '../../assets/iventory management.png';
import droneMyMedic from '../../assets/drone my medic.png';
import pocket from '../../assets/pocket.png';
import assetManagement from '../../assets/asset management.png';
import pointOfSale from '../../assets/point of sale.png';
import ProjectCard from '../../common/ProjectCard';
import notes from '../../assets/notes.png';
import ProjectModal from '../../common/ProjectModal/ProjectModal';
import { SiReact, SiVite, SiTailwindcss, SiNodedotjs, SiNextdotjs, SiExpress, SiLooker, SiGoogle, SiBootstrap, SiPhp, SiMysql, SiUnity } from 'react-icons/si';
import { MdViewList, MdGridView, MdSearch, MdClose } from 'react-icons/md';
import { BiSortAZ, BiSortZA } from 'react-icons/bi';

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const { language, t } = useLanguage();
  const items = t('projects.items');

  const categories = ['All', 'React', 'Next.js', 'Node.js', 'Tailwind', 'PHP', 'MySQL', 'Unity', 'Data'];

  const projectsData = [
    { src: freshgo, link: "https://fresh-go-fahrurojaks-projects.vercel.app/", h3: items[0].title, p: items[0].p, images: [freshgo], techStack: [<SiReact key="react" color="#61DAFB" />, <SiVite key="vite" color="#646CFF" />, <SiTailwindcss key="tw" color="#06B6D4" />], tags: ['React', 'Tailwind'] },
    { src: book, link: "https://book-shelf-fahrurojaks-projects.vercel.app/", h3: items[1].title, p: items[1].p, images: [book], techStack: [<SiReact key="react" color="#61DAFB" />, <SiNodedotjs key="node" color="#339933" />], tags: ['React', 'Node.js'] },
    { src: triftingan, link: "https://triftingan.vercel.app/", h3: items[2].title, p: items[2].p, images: [triftingan], techStack: [<SiNextdotjs key="next" />, <SiTailwindcss key="tw" color="#06B6D4" />], tags: ['Next.js', 'Tailwind'] },
    { src: minds, link: "https://minds-fahrurojaks-projects.vercel.app/", h3: items[3].title, p: items[3].p, images: [minds], techStack: [<SiReact key="react" color="#61DAFB" />, <SiTailwindcss key="tw" color="#06B6D4" />], tags: ['React', 'Tailwind'] },
    { src: kateringgo, link: "https://katering-go.vercel.app/", h3: items[4].title, p: items[4].p, images: [kateringgo], techStack: [<SiReact key="react" color="#61DAFB" />, <SiExpress key="express" />], tags: ['React', 'Node.js'] },
    { src: kimiafarma, link: "https://kfacenter.vercel.app/", h3: items[5].title, p: items[5].p, images: [kimiafarma], techStack: [<SiReact key="react" color="#61DAFB" />, <SiVite key="vite" color="#646CFF" />, <SiTailwindcss key="tw" color="#06B6D4" />, <SiNodedotjs key="node" color="#339933" />], tags: ['React', 'Node.js', 'Tailwind'] },
    { src: ptdi, link: "https://portal-dittek.vercel.app/", h3: items[6].title, p: items[6].p, images: [ptdi], techStack: [<SiReact key="react" color="#61DAFB" />, <SiBootstrap key="bs" color="#7952B3" />], tags: ['React'] },
    { src: property, link: "https://lookerstudio.google.com/reporting/611c3feb-aaea-4d6a-a843-836f731595e2/page/LQ2jD", h3: items[7].title, p: items[7].p, images: [property], techStack: [<SiLooker key="looker" color="#4285F4" />, <SiGoogle key="google" color="#4285F4" />], tags: ['Data'] },
    { src: notes, link: "https://notes-app-fahrurojaks-projects.vercel.app/", h3: items[8].title, p: items[8].p, images: [notes], techStack: [<SiReact key="react" color="#61DAFB" />, <SiVite key="vite" color="#646CFF" />], tags: ['React'] },
    { src: bankSampah, link: null, h3: items[9].title, p: items[9].p, images: [bankSampah], techStack: [<SiPhp key="php" color="#777BB4" />, <SiMysql key="mysql" color="#4479A1" />], tags: ['PHP', 'MySQL'] },
    { src: inventoryManagement, link: null, h3: items[10].title, p: items[10].p, images: [inventoryManagement], tags: [] },
    { src: droneMyMedic, link: "https://drive.google.com/drive/folders/1G9Rz--tHNSsmT_s86rjGmwkWGDnZ6dMm", h3: items[11].title, p: items[11].p, images: [droneMyMedic], techStack: [<SiUnity key="unity" />], tags: ['Unity'] },
    { src: pocket, link: null, h3: items[12].title, p: items[12].p, images: [pocket], tags: [] },
    { src: assetManagement, link: null, h3: items[13].title, p: items[13].p, images: [assetManagement], tags: [] },
    { src: pointOfSale, link: null, h3: items[14].title, p: items[14].p, images: [pointOfSale], tags: [] }
  ];

  const filteredProjects = projectsData
    .filter((project) => {
      const matchesSearch = project.h3.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.p.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || project.tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((firstProject, secondProject) => {
      const comparison = firstProject.h3.localeCompare(
        secondProject.h3,
        language,
        { sensitivity: 'base' }
      );
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <>
      <section id="projects" className={`glass-panel ${styles.container}`}>
        <div className={styles.header}>
          <h1 className="sectionTitle" style={{ marginBottom: 0 }}>{t('projects.title')}</h1>
          <div className={styles.controlsGroup}>
            <div className={styles.utilityRow}>
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
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <MdClose size={18} />
                </button>
              )}
            </div>
            <div className={styles.sortControl} role="group" aria-label={t('projects.sortProjects')}>
              <span className={styles.sortCaption}>{t('projects.sortLabel')}</span>
              <div className={styles.sortOptions}>
                <button
                  type="button"
                  className={`${styles.sortBtn} ${sortOrder === 'asc' ? styles.activeSort : ''}`}
                  onClick={() => setSortOrder('asc')}
                  aria-label={t('projects.sortAZ')}
                  aria-pressed={sortOrder === 'asc'}
                  title={t('projects.sortAZ')}
                >
                  <BiSortAZ size={22} aria-hidden="true" />
                  <span>A–Z</span>
                </button>
                <button
                  type="button"
                  className={`${styles.sortBtn} ${sortOrder === 'desc' ? styles.activeSort : ''}`}
                  onClick={() => setSortOrder('desc')}
                  aria-label={t('projects.sortZA')}
                  aria-pressed={sortOrder === 'desc'}
                  title={t('projects.sortZA')}
                >
                  <BiSortZA size={22} aria-hidden="true" />
                  <span>Z–A</span>
                </button>
              </div>
            </div>
            <div className={styles.toggleGroup}>
            <button 
              type="button"
              className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeMode : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <MdViewList size={24} />
            </button>
            <button 
              type="button"
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeMode : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <MdGridView size={24} />
            </button>
            </div>
            </div>
            <div className={styles.filterGroup}>
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilter : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                >
                  {cat === 'All' ? t('projects.all') : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        
      <div className={`${styles.projectsContainer} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.h3}
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
