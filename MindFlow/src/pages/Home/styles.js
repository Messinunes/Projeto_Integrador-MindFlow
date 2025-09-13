// src/pages/Home/HomeLayout.jsx
import styled from 'styled-components';

export const HomeBody = styled.div`
  background: linear-gradient(120deg,
    rgba(219, 242, 255, 1) 0%,
    rgba(116, 205, 255, 0.8) 40%,
    rgba(49, 51, 184, 0.9) 100%
  );
  min-height: 100vh;
  overflow: hidden;
`;

export const HomeHeader = styled.header`
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

    &:hover {
      color: var(--nav_color_hover);
      padding-bottom: 0.5rem;
      font-size: 2rem;
    }

    &:hover::before {
      width: 100%;
    }

    @media (max-width: 768px) {
      margin: 0 0.5rem;
      font-size: 1.6rem;
    }

    @media(max-width: 475px) {
      margin: 0 0.3rem;
      font-size: 1.5rem;
    }

     @media(max-width: 320px) {
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

export const HomeContainer = styled.main`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);

  @media (max-width: 768px) {
    margin-top: 120px;
    height: calc(100vh - 120px);
  }
`;

export const Content = styled.div`
  text-align: center;
  
  img {
    max-width: 100%;
    max-height: 60vh;
    object-fit: contain;
    
    @media (max-width: 768px) {
      max-height: 50vh;
    }
  }

  p {
    font-size: 2.5rem;
    color: var(--color_text_home);
    margin-top: 1rem;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 2rem;
      padding: 0 1rem;
    }
  }
`;

export const LogoHome = styled.img`
  /* tamanho original da imagem em telas grandes */
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;

  /* telas menores que 1024px */
  @media screen and (max-width: 1024px) {
    max-width: 80%;
    height: auto;
  }

  @media screen and (max-width: 768px) {
    max-width: 70%;
    height: 120px;
  }

  @media screen and (min-width: 425px) and (max-width: 768px) {
    max-width: 60%;
    height: 85px;
  }

  @media screen and (min-width: 375px) and (max-width: 425px) {
    max-width: 60%;
    height: 65px;
  }

  @media screen and (min-width: 320px) and (max-width: 375px) {
    max-width: 60%;
    height: 45px;
  }
`;


