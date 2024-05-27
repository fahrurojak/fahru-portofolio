import styles from './ProjectsStyles.module.css';
import viberr from '../../assets/viberr.png';
import freshBurger from '../../assets/fresh-burger.png';
import hipsster from '../../assets/hipsster.png';
import minds from '../../assets/fitlift.png';
import property from '../../assets/property.png';
import ProjectCard from '../../common/ProjectCard';

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectsContainer}>
        <ProjectCard
          src={viberr}
          link="https://github.com/Ade-mir/company-landing-page-2"
          h3="UMKM"
          p="Landing Page React"
        />
        <ProjectCard
          src={freshBurger}
          link="https://book-shelf-fahrurojaks-projects.vercel.app/"
          h3="Bookshelf"
          p="Save book history app"
        />
        <ProjectCard
          src={hipsster}
          link="https://fahrurojak.github.io/Triftingan/"
          h3="Triftingan"
          p="Preloved Shop"
        />
        <ProjectCard
          src={minds}
          link="https://minds-fahrurojaks-projects.vercel.app/"
          h3="Minds"
          p="Mental Health App"
        />
        <ProjectCard
          src={property}
          link="https://lookerstudio.google.com/reporting/611c3feb-aaea-4d6a-a843-836f731595e2/page/LQ2jD"
          h3="Newyork Sales Property"
          p="Project Kampus Merdeka"
        />
        <ProjectCard
          src={minds}
          link="https://minds-fahrurojaks-projects.vercel.app/"
          h3="Minds"
          p=""
        />
        <ProjectCard
          src={minds}
          link="https://minds-fahrurojaks-projects.vercel.app/"
          h3="Minds"
          p=""
        />
        <ProjectCard
          src={minds}
          link="https://minds-fahrurojaks-projects.vercel.app/"
          h3="Minds"
          p=""
        />
      </div>
    </section>
  );
}

export default Projects;
