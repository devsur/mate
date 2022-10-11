import { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [genderedUsers, setGenderedUsers] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [lastDirection, setLastDirection] = useState();
    const userId = cookies.UserId;

    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user', {
          params: {userId}
        })
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    // const getGenderedUsers = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:8000/gendered-users', {
    //       params: {gender: user?.gender_interest}
    //     });
    //     setGenderedUsers(response.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // 

    // causes infinite loop, so refactored 2nd fetch into getUserAndGenUsers
    // useEffect(() => {
    //   getUser();
    //   getGenderedUsers();
    // }, []);

    // fixes infinite loop: separate dependent fetch calls, second fetch monitors first response's state (user)
    // useEffect(() => {
    //   getUser();
    // }, []);

    // useEffect(() => {
    //   getGenderedUsers();
    // }, [user]); // fix timing issue: get user before getting gusers

    useEffect(() => {
      const getUserAndGenUsers = async () => {
        try {
          const response = await axios.get('http://localhost:8000/user', {
            params: {userId}
          })
          setUser(response.data);
          const resGen = await axios.get('http://localhost:8000/gendered-users', {
            params: {gender: response.data.gender_interest}
          });
          setGenderedUsers(resGen.data);
        } catch (err) {
          console.log(err);
        }
      };
      getUserAndGenUsers();
    }, []);

    // update user's matches
    const updateMatches = async (matchedUserId) => {
      try {
        await axios.put('http://localhost:8000/addmatch', {
        userId,
        matchedUserId
        });
        getUser(); // fetch updated data and trigger rerender
      } catch (err) {
        console.log(err);
      }
    };

    const swiped = (direction, swipedUserId) => {
      // add to user's match list on right swipe
      if (direction === 'right') updateMatches(swipedUserId);
      setLastDirection(direction)
    }
  
    const outOfFrame = (name) => {
      console.log(name + ' left the screen!')
    }

    // show only unmatched users and skip logged in user
    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId);
    // show only unmatched users
    const filteredGenderedUsers = genderedUsers?.filter(
      genderedUser => !matchedUserIds.includes(genderedUser.user_id)
    )
    return (
    <>
      {user && <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
              <div className="card-container">
              {filteredGenderedUsers?.map((genderedUser) =>
                  <TinderCard className='swipe' key={genderedUser.user_id} onSwipe={(dir) => swiped(dir, genderedUser.user_id)} onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                      <div style={{ backgroundImage: 'url(' + genderedUser.url + ')' }} className='card'>
                      <h3>{genderedUser.first_name}</h3>
                      </div>
                  </TinderCard>
              )}
              <div className='swipe-info'>
                  {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
              </div>
          </div>
      </div>}
    </>
    );
};

export default Dashboard;