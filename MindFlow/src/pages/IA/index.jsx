// src/pages/IA/index.jsx
import {
  IaBody,
  IaHeader,
  HeaderSection,
  Navbar,
  Logo,
  IaImg,
  Ia_Container,
  Division_Ia,
  Text,
  IaText
} from './styles.js';

function IA({ navigateTo }) {
  const handleNavClick = (page, event) => {
    event.preventDefault();
    if (navigateTo) {
      navigateTo(page);
    }
  };

  return (
    <IaBody>
      <IaHeader>
        <HeaderSection>
          <Logo src="src/assets/logo_navbar.png" alt="Logo Navbar" />
          <Navbar>
            <b><a href="#home" onClick={(e) => handleNavClick('home', e)}>Home</a></b>
            <b><a href="#ia" onClick={(e) => handleNavClick('ia', e)}>IA</a></b>
            <b><a href="#about" onClick={(e) => handleNavClick('about', e)}>Sobre Nós</a></b>
          </Navbar>
        </HeaderSection>
      </IaHeader>

      <Ia_Container>
        <Division_Ia>
            <div className="text-about">
                <IaText>IA no seu dia a dia</IaText>
                <Text>Bem-vindo ao MindFlow, sua solução definitiva para organização pessoal e produtividade! Nossa missão é ajudar você a gerenciar suas tarefas diárias de forma eficiente e intuitiva, permitindo que você se concentre no que realmente importa.</Text>
            </div>
            <IaImg src="src/assets/image_ia.jpg" alt="Imagem IA" />
        </Division_Ia>
      </Ia_Container>
    </IaBody>
  );
}

export default IA;