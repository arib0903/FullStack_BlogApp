import fullLogo from '../imgs/quill-drawing-a-line.png';
const FooterComp = () => {
    return(
        <footer className="mt-12 mb-12">

             <div className='mt-auto mr-10 text-center'>
                
                <div class="flex justify-center items-center ">
                    <div class="flex flex-row items-center">
                        <img src={fullLogo} alt="Writer's Avenue Logo" class="h-8 object-contain w-[90px] select-none" />
                        <p className='font-script text-2xl'>Writer's Avenue</p>
                    </div>
                </div>

                
                <p className='text-dark-grey text-sm mt-5 ml-10'>"The place to share the journey of your conscience"</p>
            </div>

        </footer>   
           
    )
}

export default FooterComp;