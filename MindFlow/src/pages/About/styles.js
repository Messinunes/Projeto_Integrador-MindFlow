// src/pages/About/AboutLayout.jsx
import styled from 'styled-components';

export const AboutBody = styled.div`
  background: rgba(219, 242, 255, 1);
  min-height: 100vh;
  overflow: hidden;
`;

export const AboutHeader = styled.header`
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

  @media screen and (min-width: 320px) and (max-width: 768px) {
    margin: 0 3rem;
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

export const About_Container = styled.main`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
`;

export const Division_About = styled.div`
    width: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;

    @media screen and (min-width: 768px) and (max-width: 1024px) {
      width: 70%;
    }

    @media screen and (min-width: 475px) and (max-width: 768px) {
      width: 80%;
      gap: 25px;
    }

    @media screen and (min-width: 320px) and (max-width: 475px) {
        width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 35px;
        flex-direction: column;
    }
`;

export const AboutImg = styled.img`
    width: 100%;
    max-width: 700px;
    height: auto;
    border-radius: 10px;

    @media screen and (min-width: 768px) and (max-width: 1024px) {
      max-width: 440px;
    }

    @media screen and (min-width: 475px) and (max-width: 768px) {
      max-width: 400px;
    }
    @media screen and (min-width: 320px) and (max-width: 375px) {
      max-width: 400px;
      margin-top: 35rem;
    }
`;

export const AboutText = styled.h1`
    font-family: "Geist", sans-serif;
    padding-bottom: 0.5rem;
    font-weight: 700;
    font-size: 37px;
    line-height: 32px;
    text-align: left;
    padding-bottom: 2.5rem;
    color: rgba(35, 31, 32, 1);

    @media screen and (min-width: 768px) and (max-width: 1024px) {
      font-size: 24px;
      line-height: 13px;
    }

    @media screen and (min-width: 475px) and (max-width: 768px) {
      font-size: 20px;
      line-height: 11px;
    }
`;

export const Text = styled.p`
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 32px;
    text-align: justify;
    color: rgba(55, 73, 87, 1);

    @media screen and (min-width: 768px) and (max-width: 1024px) {
      font-size: 12px;
    }

    @media screen and (min-width: 475px) and (max-width: 768px) {
      font-size: 9.1px;
    }

    @media screen and (min-width: 425px) and (max-width: 475px) {
      font-size: 12px;
    }

    @media screen and (min-width: 375px) and (max-width: 425px) {
      padding-bottom: 3rem;
      font-size: 12px;
    }

    @media screen and (min-width: 320px) and (max-width: 375px) {
      padding-bottom: 35rem;
      font-size: 12px;
    }
`;
