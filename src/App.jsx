import { Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import NotFound from './components/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
