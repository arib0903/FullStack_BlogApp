import { Link } from 'react-router-dom';
import pageNotFoundImage from '../imgs/404.png';
import fullLogo from '../imgs/quill-drawing-a-line.png';

const PageNotFound = () => {

    return (
        <section className="h-cover flex flex-col items-center gap-20 text-center relative p-10">
            <img src ={pageNotFoundImage} className='select-none border-2 border-grey w-72 aspect-square object-cover rounded'/> 
            <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
            <p className='text-dark-grey text-xl leading-7 -mt-8'>The page you are looking for has not been implemented yet. Head back to <Link to = "/" className='text-black underline'>Home Page</Link> </p>

            <div className='mt-auto mr-10'>
                
                <div class="flex justify-center items-center ">
                    <div class="flex flex-row items-center">
                        <img src={fullLogo} alt="Writer's Avenue Logo" class="h-8 object-contain w-[90px] select-none" />
                        <p className='font-script text-2xl'>Writer's Avenue</p>
                    </div>
                </div>

                
                <p className='text-dark-grey text-sm mt-5 ml-10'>"The place to share the journey of your conscience"</p>
            </div>
        </section>
    )
}

export default PageNotFound;