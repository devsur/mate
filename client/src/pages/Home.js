import { useState } from 'react';
import Nav from '../components/Nav';
import AuthModal from '../components/AuthModal';
import { useCookies } from 'react-cookie';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const authToken = cookies.AuthToken;
    
    const handleClick = () => {
        // handle signout
        if (authToken) {
            removeCookie('UserId', cookies.UserId);
            removeCookie('AuthToken', cookies.AuthToken);
            window.location.reload();
            return;
        }
        setShowModal(true);
        setIsSignUp(true);
    };
    return (
        <div className='overlay'>
            <Nav minimal={false} setShowModal={setShowModal} showModal={showModal} setIsSignUp={setIsSignUp} authToken={authToken} />
            <div className="home">
                <h1 className='primary-title'>Swipe Right</h1>
                <button
                    className="primary-button"
                    onClick={handleClick}>{authToken ? 'Signout' : 'Create Account'}
                </button>
                {showModal && <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />}
            </div>
        </div>
    );
};

export default Home;