import styled from "styled-components";

export const CadastroBody = styled.div`
  background: linear-gradient(
    120deg,
    rgba(219, 242, 255, 1) 0%,
    rgba(116, 205, 255, 1) 40%,
    rgba(49, 51, 184, 1) 99%
  );
  height: 100vh;
  overflow: hidden;
`;

/* Corrigido nome aqui */
export const CadastroHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: var(--blue_line);
  box-shadow: 0 2px 10px rgba(49, 51, 184, 0.2);
`;

export const HeaderSection = styled.section`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  margin: 0 5rem;

  @media (max-width: 768px) {
    margin: 0 2rem;
    height: 70px;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
`;

export const Navbar = styled.nav`
  /* 🔹 Links gerais do Navbar */
  a {
    position: relative;
    font-family: "Geist", sans-serif;
    margin: 0 1rem;
    font-size: 1.8rem;
    color: var(--nav_color);
    text-decoration: none;
    transition: color 0.3s ease, font-size 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 4px;
      background: linear-gradient(90deg, #1E1B5B, #193676, #2791BC);
      border-radius: 0;
      transition: all 0.5s ease-in-out;
    }
  }

  /* 🔹 Hover apenas para links que NÃO são Login */
  a:not(.login_nav):hover {
    color: var(--nav_color_hover);
    padding-bottom: 0.5rem;
    font-size: 2rem; /* aumenta apenas os links normais */
  }

  a:not(.login_nav):hover::before {
    width: 100%; /* underline animado apenas para links normais */
  }

  /* 🔹 BOTÃO LOGIN */
  .login_nav {
    font-size: 1.2rem;
    background-color: white;
    color: #3133B8;
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    border: 3px solid #3133B8;
    transition: background-color 0.3s ease, color 0.3s ease;
    text-decoration: none; /* remove sublinhado */
    display: inline-block;
    position: relative;
  }

  /* 🔹 Remove qualquer pseudo-elemento do botão Login */
  .login_nav::before {
    display: none;
    content: none;
  }

  /* 🔹 Hover do botão Login apenas muda cor */
  .login_nav:hover {
    color: white;
    background-color: #3133B8;
  }

  @media (max-width: 768px) {
    a {
      margin: 0 0.5rem;
      font-size: 1.6rem;
    }
  }

  @media(max-width: 475px) {
    a {
      margin: 0 0.3rem;
      font-size: 1.5rem;
    }
  }

  @media(max-width: 320px) {
    a {
      margin: 0 0.2rem;
      font-size: 1.1rem;
    }
  }
`;

export const Logo = styled.img`
  height: 200px;
  width: auto;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

export const Container_Cadastro = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 100px; /* compensa o header fixo */
  box-sizing: border-box;
`;


export const CadastroWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  width: 850px;
  height: 400px;

  @media (max-width: 900px) {
    flex-direction: column;
    width: 90%;
    height: auto;
  }
`;

export const CadastroBox = styled.div`
  flex: 1;
  background-color: rgba(59, 130, 246, 1);
  backdrop-filter: blur(10px);
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    font-family: "Geist", sans-serif;
    font-size: 3rem;
    font-weight: bold;
    color: #1e1b5b;
    margin-bottom: 2rem;
    text-align: left;
  }
`;

export const ImageBox = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #b6e0ff, #dceeff);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-width: 100%;
    max-height: auto;
    border-radius: 0 0 0 10px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const CadastroImg = styled.img`
  /* tamanho original da imagem em telas grandes */
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  label {
    font-size: 1.2rem;
    color: #1e1b5b;
    margin-bottom: 0.4rem;
  }
`;

export const Input = styled.input`
  width: 94%;
  padding: 0.7rem 1rem;
  border: 3px solid rgba(116, 205, 255, 1);
;
  border-radius: 20px;
  background: transparent;
  font-size: 1rem;
  color: #1e1b5b;
  outline: none;

  &::placeholder {
    color: rgba(30, 27, 91, 0.6);
  }

  &:focus {
    border-color: rgba(49, 51, 184, 1);
    box-shadow: 0 0 6px rgba(39, 145, 188, 0.3);
  }
`;

export const CadastroButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
`;

export const Button = styled.button`
  background:rgba(116, 205, 255, 1);
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.8rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 8em;
  height: 3em;

  &:hover {
    color: #fff;
    background: #412aeeff;
    transform: scale(1.05);
    font-size: 1.1rem;
  }
`;

export const RegisterLink = styled.a`
  color: #1e1b5b;
  text-decoration: none;
  font-size: 1.05rem;

  &:hover {
    text-decoration: underline;
    font-weight: 600;
    color: rgba(49, 51, 184, 1);
  }

  &:hover span {
    color: rgba(116, 205, 255, 1) !important; /* cor do span ao passar o mouse */
  }
`;
