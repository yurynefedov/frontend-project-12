import { Link } from 'react-router-dom';
import { Navbar as NavigationBar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/index.js';
import routes from '../routes';

const NavBar = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'navBar' });
  const { loggedIn, logOut } = useAuth();

  return (
    <NavigationBar bg="white" expand="lg" className="shadow-sm">
      <Container className="container">
        <NavigationBar.Brand as={Link} to={routes.chatPagePath()}>
          {t('header')}
        </NavigationBar.Brand>
        {
          loggedIn && (
            <Button onClick={logOut}>{t('exitButton')}</Button>
          )
        }
      </Container>
    </NavigationBar>
  );
};

export default NavBar;
