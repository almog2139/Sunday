import React, { Component } from 'react'
import { NavLink, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import sunday from "../assets/img/sunday.png"


class _HomeHeader extends Component {
    state = {
        isNavOpen: false,
        isScrolled: false,
        scrollTop: 0
    }

    // componentDidMount() {
    //     console.log('check',this.props.location.pathname);
    //     window.addEventListener("scroll", this.handleScroll);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener("scroll", this.handleScroll);
    // }

    // handleScroll = () => {
    //     const excludedRoutes = [
    //         '/',
    //         '/login',
    //         '/signup'
    //     ]
    //     if (window.scrollY > 0&&excludedRoutes.indexOf(this.props.location.pathname) > 0 ){
    //         document.querySelector(".home-header-container").className = "flex home-header-container header-shadow";
    //     } else if(excludedRoutes.indexOf(this.props.location.pathname) > 0 ){
    //         document.querySelector(".home-header-container").className = "flex home-header-container";
    //     }
    // };
    
    //function that effect if show nav
    toggleMobileNav = () => {
        const { isNavOpen } = this.state;
        this.setState({ isNavOpen: !isNavOpen });
    }

    render() {
        const { isNavOpen } = this.state;
        return <header ref={this.scrollRef} onScroll={this.onScroll} className={`home-header-container flex`}>
            <Link to="/"> <img src={sunday} alt="sunday logo" /> </Link>
            <nav>
                <div className={`hamburger ${isNavOpen ? 'open' : ''}`} onClick={this.toggleMobileNav}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={`flex nav-list ${isNavOpen ? 'open-nav' : ''}`}>
                    <li><NavLink activeClassName="nav-active" to="/login">Log in</NavLink></li>
                    <li><NavLink activeClassName="nav-active" to="/signup" exact>Sign up</NavLink></li>
                    {/* <li><NavLink className="home-header-login-btn" exact to="/board">Try as guest</NavLink></li> */}
                    <li><a className="home-header-login-btn" onClick={(ev)=>this.props.doLoginByGuest(ev)}>Try as guest</a></li>
                </ul>
            </nav>
        </header>
    }
}


const mapGlobalStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}

const mapDispatchToProps = {

}


export const HomeHeader = withRouter(connect(mapGlobalStateToProps, mapDispatchToProps)(_HomeHeader));