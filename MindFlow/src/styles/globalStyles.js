// src/styles/globalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

  :root {
    --nav_color: rgba(49, 51, 184, 1); /* AZUL MÉDIO */
    --nav_color_hover: rgba(36, 38, 140, 1); /* AZUL MÉDIO/ESCURO */
    --color_text_home: rgba(55, 73, 87, 1); /* CINZA AZULADO */
    --bg: linear-gradient(120deg,
        rgba(219, 242, 255, 1) 0%,     /* BRANCO AZULADO */
        rgba(116, 205, 255, 0.8) 40%,  /* AZUL CLARO */
        rgba(49, 51, 184, 0.9) 100%    /* AZUL ESCURO */
    );
    --border: 0.1rem solid rgba(255, 255, 255, 0.3);
    --blue_line: 3px solid rgba(49, 51, 184, 1); /* LINHA AZUL */
    font-size: 10px;
}

* {
    margin: 0;
    padding: 0;
    outline: none;
    border: none;
    text-decoration: none;
    text-transform: capitalize;
    transition: 0.2s linear;
    font-family: 'Geist', sans-serif;
}

.section {
    padding: 3rem 2rem;
    margin: 0 auto;
    max-width: 1200px;
}
`;

export default GlobalStyle;