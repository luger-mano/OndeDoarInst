import "./Footer.css"
import { Link } from 'react-router-dom';

export default function Footer(){

    return(   
    <div>
                    <footer className="Footer">
              <div className="footer-logo">
             
              </div>

              <div className="Footer-links">
                <div className="col">
                  <ul>
                    <li><h2>Informações de contato</h2></li>
                    <li>Telefone: 11 96926-6214</li>
                    <li>Email: contato@hugosevero.com</li>
                    <li><Link to="https://www.linkedin.com/in/hugosevero/">Linkedin: https://www.linkedin.com/in/hugosevero/ </Link></li>
                  </ul>
                </div>
                <div className="col">
                  <ul>
                    <li><a href="/info#quem-somos">Quem somos</a></li>
                    <li><a href="/info#porque-doar">Por que doar?</a></li>
                    <li><a href="/info#requisitos">Requisitos de Doação</a></li>
                  </ul>
                </div>
              </div>

              <div className="Footer-bottom">
                <div className="copyright">
                  © {new Date().getFullYear()} Onde Doar.
                </div>
              </div>
            </footer>
    </div>


    );

}