import React from "react";
import {
  CadastroBody,
  CadastroHeader,
  HeaderSection,
  Navbar,
  Logo,
  Container_Cadastro,
  CadastroWrapper,
  CadastroBox,
  ImageBox,
  CadastroImg,
  FormGroup,
  Input,
  CadastroButton,
  Button,
  RegisterLink,
} from "./styles.js";

// ADICIONE navigateTo como prop aqui
function Cadastro({ navigateTo }) {
  return (
    <CadastroBody>
      <CadastroHeader>
        <HeaderSection>
          <Logo src="src\assets\logo_navbar.png" alt="Logo Navbar" />
          <Navbar>
            <b><a href="home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></b>
            <b><a href="IA" onClick={(e) => { e.preventDefault(); navigateTo('ia'); }}>IA</a></b>
            <b><a href="about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>Sobre Nós</a></b>
            <b><a class="login_nav" href="#login" onClick={(e) => { e.preventDefault(); navigateTo('login', e)}}>Login</a></b>
          </Navbar>
        </HeaderSection>
      </CadastroHeader>

      <Container_Cadastro>
        <CadastroWrapper>
          <ImageBox>
            <CadastroImg src="src\assets\imagem_cadastro.png" alt="MindFlow" />
          </ImageBox>
          <CadastroBox>
            <h2>Cadastro</h2>
            <form>
              <FormGroup>
                <label>Nome:</label>
                <Input type="text" placeholder="Digite seu Nome" />
              </FormGroup>

              <FormGroup>
                <label>Email:</label>
                <Input type="text" placeholder="Digite seu email" />
              </FormGroup>

              <FormGroup>
                <label>Senha:</label>
                <Input type="password" placeholder="Digite sua senha" />
              </FormGroup>

              <CadastroButton>
                <Button type="submit">Cadastrar</Button>
                {/* CORREÇÃO AQUI: Mude para login e adicione o onClick */}
                <RegisterLink 
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('login');
                  }}
                >
                  Já possui <span>Login</span>?
                </RegisterLink>
              </CadastroButton>
            </form>
          </CadastroBox>
        </CadastroWrapper>
      </Container_Cadastro>
    </CadastroBody>
  );
}

export default Cadastro;