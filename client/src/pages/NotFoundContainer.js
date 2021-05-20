import { Link } from 'react-router-dom';

const NotFound = () => {
    return ( 
        <div className="not-found">
            <h2>Sorry... But I'm not sorry.</h2>
            <p>That page cannot be found.</p>
            <Link to="/">Back to the homepage...</Link>
        </div>
    );
}
 
export default NotFound;