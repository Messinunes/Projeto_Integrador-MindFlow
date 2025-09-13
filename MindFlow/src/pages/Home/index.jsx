// src/pages/Home/index.jsx
import {
  HomeBody,
  HomeHeader,
  HeaderSection,
  Navbar,
  Logo,
  LogoHome,
  HomeContainer,
  Content
} from './styles.js';

function Home() {
  return (
    <HomeBody>
      <HomeHeader>
        <HeaderSection>
          <Logo src="src/assets/logo_navbar.png" alt="Logo Navbar" />
          <Navbar>
            <b><a href="home">Home</a></b>
            <b><a href="IA">IA</a></b>
            <b><a href="about">Sobre Nós</a></b>
          </Navbar>
        </HeaderSection>
      </HomeHeader>

      <HomeContainer>
        <Content>
          <LogoHome src="src/assets/logo_home.png" alt="Logo Home" />
          <p>Organização inteligente para mentes em movimento</p>
        </Content>
      </HomeContainer>
    </HomeBody>
  );
}

export default Home;
