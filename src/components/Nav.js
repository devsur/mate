import colorLogo from '../images/logo.png';
import whiteLogo from '../images/logo_transparent.png';

const Nav = ({ minimal, authToken, setShowModal, showModal }) => {
    const handleClick = () => {
        setShowModal(true);
    }
    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src={minimal ? colorLogo : whiteLogo} />
            </div>
            {!authToken & !minimal && <button className='nav-button' onClick={handleClick} disabled={showModal}>Log In</button>}
        </nav>
    );
};

export default Nav;