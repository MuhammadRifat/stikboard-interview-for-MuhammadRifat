import React, { useContext } from 'react';
import { Container, Image } from 'react-bootstrap';
import { userContext } from '../../App';
import logo from '../../images/spacex-logo1.png';

const Header = () => {
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    return (
        <Container className="text-center">
            <Image className="w-50" src={logo} alt="" />
            {
                loggedInUser.email &&
                <button
                    onClick={() => setLoggedInUser({})}
                    className="bg-light"
                    style={{ border: 'none', borderRadius: '5px', marginLeft: '20px' }}
                >
                    Log out
                </button>
            }
        </Container>
    );
};

export default Header;