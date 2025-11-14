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
  

function Home({ navigateTo }) {
  const handleNavClick = (page, event) => {
    event.preventDefault();
    console.log('🖱️ Clicou no link:', page); // DEBUG
    if (navigateTo) {
      navigateTo(page);
    } else {
      console.log('❌ navigateTo não está definido');
    }
  };

  return (
    <HomeBody>
      <HomeHeader>
        <HeaderSection>
          <Logo src="src/assets/logo_navbar.png" alt="Logo Navbar" />
          <Navbar>
            <b><a href="home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></b>
            <b><a href="IA" onClick={(e) => { e.preventDefault(); navigateTo('ia'); }}>IA</a></b>
            <b><a href="about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>Sobre Nós</a></b>
            <b><a class="login_nav" href="#login" onClick={(e) => { e.preventDefault(); navigateTo('login', e)}}>Login</a></b>
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