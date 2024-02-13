 
 import logo from '../../imgs/quill-drawing-a-line.png';

    import { Link, Outlet, useNavigate } from 'react-router-dom';
    import { useContext, useState } from 'react';
    import { UserContext } from '../../App';
    import UserNavigationPanel from './user-navigation.component';
 
 const Navbar = () => {

    // 1. CREATE VAR FOR TOGGLING NAVBAR PANEL & SEARCH BOX
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);
    
    let navigate = useNavigate();

    // 2. 
    const { userAuth:{access_token, profile_img}} = useContext(UserContext);
    

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    }

    const handleSearch = (e) => {
        let query = e.target.value;
        
        if(e.keyCode == 13 && query.length){
            navigate(`/search/${query}`)
        }
    }


    return (
        <> 

        <nav className="navbar">
                <Link to = "/" className='flex-none w-15 '>
                    <img src={logo} className='flex-none h-10 object-contain' />
                     <p className='font-script text-lg '>Writer's Avenue</p>
                </Link>

                {/* Creating search bar */}
                <div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + (searchBoxVisibility ? 'show':'hide')}>
                    <input type="text" placeholder='Search' className='w-full md:w-auth bg-grey p-4 pl-g pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12' onKeyDown={handleSearch}/>
                    <i className='fi fi-rr-search absolute right-[10%] md: pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
                </div>
                


                {/* Creating navbar elements */}
                <div className='flex items-center gap-3 md:gap-6 ml-auto '>
                    {/* Creating search button for smaller devices*/}
                    <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center' onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}> 
                        <i className='fi fi-rr-search text-xl'></i>
                    </button>



                    {/* Creating write button */}
                    <Link to = "/editor" className='hidden md:flex gap-2 link'>
                        <i className='fi fi-rr-file-edit'></i>
                        <p> Write </p>
                    </Link>
                    



                    {/* IF LOGGED IN, DISPLAY NOTIFICATION AND NAVPANEL */}
                    {
                        access_token ?  
                        <>
                        <Link to = "/dashboard/notification">
                            <button className = 'w-12 h-12 rounded-full bg-grey relative gover:bg:black/10'>
                                <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                            </button>
                        </Link>
                        
                        {/* Creating user profile button */}
                        <div className='relative' onClick={handleUserNavPanel} onBlur = {handleBlur}>
                            <button className='w-12 h-12 mt-1'>
                                <img src={profile_img} className='w-full h-full object-cover rounded-full'/>
                            </button>
                            {/* Display nav panel if clicked(userNavPanel = true) */}
                            {
                                userNavPanel ? <UserNavigationPanel/> : ""
                            }
                        </div>


                        </> : 
                        // IF NOT LOGGED IN, DISPLAY SIGN IN/UP BUTTONS
                        <>
                        <Link className='btn-dark py-2' to = "/signin">
                            Sign In
                        </Link>
                        <Link className='btn-light py-2 hidden md:block' to = "/signup">
                                Sign Up
                        </Link>
                        </>
                    }
                    
                </div>
        </nav>

        {/* This outlet allows us to do nested routes like in app.jsx so it can dispaly both "signup/in page" texts*/}
        <Outlet/>
    </>
        )
    }

 export default Navbar;
