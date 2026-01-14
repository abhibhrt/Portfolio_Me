import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './components/Header/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Projects from './pages/Projects/Projects.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Footer from './components/Footer/Footer.jsx';
import Progress from "./pages/Progress/Progress.jsx";
import Auth from './components/Admin/Auth.jsx';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>Abhishek Bharti | MERN Stack Developer & Freelancer</title>
        <meta
          name="description"
          content="Abhishek Bharti is a MERN stack web developer and freelancer. Explore his portfolio featuring modern, responsive, and high-performance websites."
        />
        <meta
          name="keywords"
          content="Abhishek Bharti, MERN developer, freelance web developer, React developer, full stack, portfolio"
        />
        <link rel="canonical" href="https://abhibhrt.vercel.app/" />
      </Helmet>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/admin" element={<Auth />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
