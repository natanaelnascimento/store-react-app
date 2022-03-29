import M from 'materialize-css';
import React, { useContext, useEffect } from 'react';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Link } from 'react-router-dom';
import { PageContext } from '../helpers/pageContext';
import AuthenticationService from '../services/AuthenticationService';

export default function Navigation({title, sidebar = true, ...props}) {

    const { promiseInProgress } = usePromiseTracker();
    const [userName, setSessionId] = useContext(PageContext);

    useEffect(() => {
        let elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);
    }, []);

    const handleLogoutClick = async () => {
        await trackPromise(AuthenticationService.logout());
        setSessionId('');
    }

    let colClassName = userName && sidebar ? 'col s12 m12 l8 offset-l4 xl9 offset-xl3' : '';
    let topNavStyles = userName && sidebar ? STYLES.topNav : {...STYLES.topNav, ...STYLES.topNavAuthenticated};

    return (
        <>
            <header>
                <nav className='top-nav' style={topNavStyles}>
                    <div className='row'>
                        <div className={colClassName}>
                            <div className='nav-wrapper'>
                                <Link to='/' className='brand-logo'>Store App</Link>
                            </div>
                        </div>
                        {userName &&
                            <div className='container'>
                                <a href='#!' data-target='nav-mobile' className='top-nav sidenav-trigger full hide-on-large-only'>
                                    <i className='material-icons'>menu</i>
                                </a>
                            </div>
                        }
                    </div>
                </nav>
                <div style={promiseInProgress ? STYLES.visibleLoading : STYLES.hiddenLoading} className='progress'>
                    <div  className='indeterminate'></div>
                </div>
                {userName && sidebar &&
                    <ul id='nav-mobile' className='sidenav sidenav-fixed'>
                        <li>
                            <div style={STYLES.userContainer}>
                                <span><i className='large material-icons'>person</i></span>
                                <h5 style={STYLES.userName}>{userName}</h5>
                            </div>
                        </li>
                        <li><div className='divider'></div></li>
                        <li><Link to='/'><i className='material-icons'>equalizer</i>Painel</Link></li>
                        <li><Link to='/products'><i className='material-icons'>local_mall</i>Produtos</Link></li>
                        <li><Link to='/clients'><i className='material-icons'>face</i>Clientes</Link></li>
                        <li><Link to='/cart'><i className='material-icons'>shopping_cart</i>Carrinho</Link></li>
                        <li><div className='divider'></div></li>
                        <li><a href='#!' onClick={handleLogoutClick}><i className='material-icons'>exit_to_app</i>Logout</a></li>
                    </ul>
                }
            </header>
            <main>
                <div className='row'>
                    <div className={colClassName}>
                        <div className='container'>
                        <div className='row'>
                            <div className='col l12 m12 s12'>
                                <h4 className='center'>{title}</h4>
                            </div>
                        </div>
                        </div>
                        {props.children}
                    </div>
                </div>
            </main>
        </>
    )
}

const STYLES = {
    topNav: {
        backgroundColor: '#00675b'
    },
    topNavAuthenticated: {
        paddingLeft: '2rem'
    },
    hiddenLoading: {
        opacity: 0
    },
    visibleLoading: {
        opacity: 1
    },
    userContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    userName: {
        marginTop: '0px'
    },
    navMobile: {
        transform: 'translateX(0%)'
    }
}