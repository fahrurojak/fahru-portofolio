import styles from './ProjectsStyles.module.css';
import property from '../../assets/property.png';
import book from '../../assets/book.png';
import minds from '../../assets/minds.png';
import triftingan from '../../assets/triftingan.png';
import chatdoc from '../../assets/chatdoc.png';
import ProjectCard from '../../common/ProjectCard';

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectsContainer}>
        <ProjectCard
          src={property}
          link="https://github.com/Ade-mir/company-landing-page-2"
          h3="UMKM"
          p="Landing Page React"
        />
        <ProjectCard
          src={book}
          link="https://book-shelf-fahrurojaks-projects.vercel.app/"
          h3="Bookshelf"
          p="Save book history app"
        />
        <ProjectCard
          src={triftingan}
          link="https://triftingan.vercel.app/"
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
          link="https://minds-fahrurojaks-projects.vercel.app/"
          h3="Minds"
          p="Laravel"
        />
        <ProjectCard
          src={chatdoc}
          link="https://minds-fahrurojaks-projects.vercel.app/"
          h3="Chatdoc"
          p="Project Kampus Merdeka"
        />
       <ProjectCard
          src={property}
          link="https://lookerstudio.google.com/reporting/611c3feb-aaea-4d6a-a843-836f731595e2/page/LQ2jD"
          h3="Newyork Sales Property"
          p="Project Kampus Merdeka"
        />
        <ProjectCard
          src={property}
          link="https://minds-fahrurojaks-projects.vercel.app/"
          h3="Minds"
          p="Myskill Project"
        />
      </div>
    </section>
  );
}

export default Projects;
