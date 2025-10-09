// src/pages/About/index.jsx
import {
  AboutBody,
  AboutHeader,
  HeaderSection,
  Navbar,
  Logo,
  AboutImg,
  About_Container,
  Division_About,
  Text,
  AboutText
} from './styles.js';

function About({ navigateTo }) {
  const handleNavClick = (page, event) => {
    event.preventDefault();
    if (navigateTo) {
      navigateTo(page);
    }
  };

  return (
    <AboutBody>
      <AboutHeader>
        <HeaderSection>
          <Logo src="src/assets/logo_navbar.png" alt="Logo Navbar" />
          <Navbar>
            <b><a href="#home" onClick={(e) => handleNavClick('home', e)}>Home</a></b>
            <b><a href="#ia" onClick={(e) => handleNavClick('ia', e)}>IA</a></b>
            <b><a href="#about" onClick={(e) => handleNavClick('about', e)}>Sobre Nós</a></b>
          </Navbar>
        </HeaderSection>
      </AboutHeader>

      <About_Container>
        <Division_About>
            <AboutImg src="src/assets/image_about.png" alt="Imagem Sobre Nós" />
            <div className="text-about">
                <AboutText>Sobre Nós</AboutText>
                <Text>Bem-vindo ao MindFlow, sua solução definitiva para organização pessoal e produtividade! Nossa missão é ajudar você a gerenciar suas tarefas diárias de forma eficiente e intuitiva, permitindo que você se concentre no que realmente importa.</Text>
            </div>
        </Division_About>
      </About_Container>
    </AboutBody>
  );
}

export default About;