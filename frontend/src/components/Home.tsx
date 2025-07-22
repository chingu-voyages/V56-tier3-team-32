import { Link } from 'react-router-dom';
import "./Home.css"

export default function Home() {
    return (
        <>
            <div className='hero'>
                <div className='nav-bar'>
                        <Link to="/status">
                            <button className='status-btn btn'>See Patient Status</button>
                        </Link>
                        <Link to="/register" >
                            <button className='register-btn btn'>Register New Patient</button>
                        </Link>
                </div>
            </div>
        </>
    )
}