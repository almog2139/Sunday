import React from 'react'
import undrawtask from '../assets/img/undrawtask.svg';
import { Link } from 'react-router-dom';
import { HomeHeader } from '../cmps/HomeHeader';
import { useDispatch, useSelector } from 'react-redux'
import { checkLogin } from '../store/actions/userAction.js'
import { loadBoards } from '../store/actions/boardAction.js'
import { socketService } from '../services/socketService.js';
import { updateUserNotifications } from '../store/actions/userAction.js'


export function Home({ match, history, ...restOfProps }) {


    // const { boards } = useSelector(state => state.boardReducer)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(loadUsers())
    // }, [])

     const doLoginByGuest = async ev => {
        ev.preventDefault()
       const loginCred={
           username:'guest',
           password:'1234'
        }
            
            const user = await dispatch(checkLogin({ ...loginCred }))
            console.log('user',user);
            if (user) {
                socketService.setup()
                socketService.emit('userSocket', user)
                socketService.on('updateUser',dispatch(updateUserNotifications))
                const boards = dispatch(loadBoards(user._id))
                const path = (boards.length) ? `/board/${boards[0]._id}` : '/board'
                history.push(path)
            }
       
    }

    return <div className="home-main-container">
        <HomeHeader doLoginByGuest={doLoginByGuest}/>
        <div className="home-hero relative">
            <div className="home-hero-inner" >
                <div className="home-hero-titles flex">
                    <h2>Join the <span>Sunday</span> revolution</h2>
                    <h3>Manage your project with the team, all in one workspace</h3>
                    <a onClick={doLoginByGuest}>Get started!</a>
                    {/* <Link to="/board">Get started!</Link> */}
                </div>
                    <img src={undrawtask} alt="undraw task img" />
            </div>
            <div className="custom-shape-divider-bottom-1611473823">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill"></path>
                </svg>
            </div>
        </div>
    </div>
}
