import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const MatchesDisplay = ({matches, setClickedUser}) => {
    const [matchedProfiles, setMatchedProfiles] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const matchedUserIds = matches.map(({user_id}) => user_id);
    const userId = cookies.UserId;
    // fetch matched user objects given user ids
    const getMatches = async () => {
        try {
            // send array of matched ids as userIds
            const response = await axios.get('http://localhost:8000/users', {
                params: {userIds: JSON.stringify(matchedUserIds)}
            });
            setMatchedProfiles(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getMatches();
    }, [/* matches */]); // only get matches if user's matches exist/update

    // add filter to display only actual mutual matches where both users swiped right
    // filter user.matches for each match if match also includes user's id in their .matches list
    const filteredMatchedProfiles = matchedProfiles?.filter(matchedProfile => matchedProfile.matches.filter(profile => profile.user_id === userId).length > 0);
    return (
        <div className="matches-display">
            {filteredMatchedProfiles?.map((match) => (
                <div key={match.user_id} className="match-card" onClick={() => setClickedUser(match)}>
                    <div className='img-container'>
                        <img src={match?.url} alt={`${match?.first_name}-profile`} />
                    </div>
                    <h3>{match?.first_name}</h3>
                </div>
            ))}
        </div>
    );
}

export default MatchesDisplay;