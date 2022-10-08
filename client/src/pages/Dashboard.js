import { useState } from 'react';
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';

const Dashboard = () => {
    const characters = [
        {
          name: 'Richard Hendricks',
          url: 'https://images.unsplash.com/photo-1525450754258-0f4cbd02718d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
        },
        {
          name: 'Erlich Bachman',
          url: 'https://images.unsplash.com/photo-1525450754258-0f4cbd02718d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
        },
        {
          name: 'Monica Hall',
          url: 'https://images.unsplash.com/photo-1525450754258-0f4cbd02718d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
        },
        {
          name: 'Jared Dunn',
          url: 'https://images.unsplash.com/photo-1525450754258-0f4cbd02718d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
        },
        {
          name: 'Dinesh Chugtai',
          url: 'https://images.unsplash.com/photo-1525450754258-0f4cbd02718d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
        }
    ];
    const [lastDirection, setLastDirection] = useState();
  
    const swiped = (direction, nameToDelete) => {
      console.log('removing: ' + nameToDelete)
      setLastDirection(direction)
    }
  
    const outOfFrame = (name) => {
      console.log(name + ' left the screen!')
    }
    return (
    <div className="dashboard">
        <ChatContainer />
        <div className="swipe-container">
            <div className="card-container">
            {characters.map((character) =>
                <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
                    <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                    <h3>{character.name}</h3>
                    </div>
                </TinderCard>
            )}
            <div className='swipe-info'>
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
            </div>
            </div>
        </div>
    </div>
    );
};

export default Dashboard;