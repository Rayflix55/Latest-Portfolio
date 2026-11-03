import Hero from '../components/Hero.jsx';
import Sidebar from '../components/Sidebar.jsx';
import About from '../components/About.jsx';
import Projects from '../components/Projects.jsx';
import Stack from '../components/Stack.jsx';
import Activity from '../components/Activity.jsx';
import Experience from '../components/Experience.jsx';
import Services from '../components/Services.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Contact from '../components/Contact.jsx';

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <div className="mx-auto box-border flex max-w-[1160px] flex-wrap items-start gap-8 px-6 pb-20">
        <Sidebar />
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-[clamp(56px,8vw,96px)]">
          <About />
          <Projects />
          <Stack />
          <Activity />
          <Experience />
          <Services />
          <Testimonials />
          <Contact />
        </div>
      </div>
    </main>
  );
}
