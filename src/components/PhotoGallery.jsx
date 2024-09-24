import React, {useState, useEffect} from 'react'
import axios from 'axios';
import heart_icon from "../assets/heart.svg"
import up_icon from "../assets/up.svg"
import battery from "../assets/battery.svg"
import InfiniteScroll from 'react-infinite-scroll-component';

const PhotoGallery = () => {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [scrollBtn, setScrollBtn] = useState(false);
    // const [page, setPage] = useState(0);
    const apiKey =  import.meta.env.VITE_ACCESS_KEY;

    const fecthPhotos = async () => {
        setLoading(true)
        const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${10}`
        
        if (!apiKey) {
            setError('API key is missing');
            return;
        }

        try{
            const res = await axios.get(apiUrl,{
                headers:{
                    'X-API-Key' : apiKey,
                }
            })
                setPhotos([...photos, ...res.data]);
                setError(null)
                setLoading(true);
                console.log(res.data)
        }catch(err){
            setError(`Error: ${err.response?.status} ${err.response?.statusText}`);
            console.error(err)
            setLoading(false)
        }
    };

    useEffect(() =>{
        fecthPhotos();
    },[])

    // Handle bouncing button to scroll to top after 300 px of window
    const handleScrollToTop =() =>{
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
   }
   useEffect(()=>{
    //button will be displayed after scrolling for 300 pixels
    const handleScrollVisibility = () =>{
        window.scrollY > 300 ? setScrollBtn(true) : setScrollBtn(false)
    };
    window.addEventListener('scroll', handleScrollVisibility);
    return() =>{
        window.removeEventListener('scroll', handleScrollVisibility)
    };
    }, [])

    // useEffect(() => {
    //     const event = window.addEventListener("scroll", () => {
    //       if (
    //         (!loading && window.innerHeight + window.scrollY) >=
    //         document.body.scrollHeight - 2
    //       ) {
    //         setPage((oldPage) => {
    //           return oldPage + 1;
    //         });
    //       }
    //     });
    
    //     return () => window.removeEventListener("scroll", event);
    //   }, []);
    return (
    <div className='bg-slate-100 h-[100%]'>
        <p className='p-8 text-center font-extrabold text-blue-400 text-3xl'>Photo Galllery</p>
        <InfiniteScroll
        dataLength={photos}
        next={() => fecthPhotos(5)}
        hasMore={true}
        loader={
            <div className='flex justify-center items-center'>
                <img src={battery} alt="loading"  className='w-20'/>
            </div>
        }
        >
            <div className="grid grid-cols-1  sm:grid-cols-2  gap-4 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 place-items-center w-full my-10 ">
                                {loading ? 
                                photos.map((photo, index) =>(
                                    <div key={index} className='shadow-2xl  h-[420px]  w-[390px] sm:h-[420px] sm:w-[310px] rounded-lg overflow-hidden relative mb-10 transition ease-in-out duration-150 cursor-pointer'>
                                        <div className='h-80 w-96 sm:w-[360px]'>
                                            <img src={photo.urls.regular} alt={photo.urls.alr_description}  className='object-cover w-full h-full'/>
                                        </div>
                                        <div className='flex justify-between items-center gap-4 mx-5 my-5'>
                                            <div className='flex items-center gap-2'>
                                                <img src={photo.user.profile_image.medium} alt="Artist image" className='rounded-full w-10' />
                                                <p className=' text-md'>{photo.user.name}</p>
                                            </div>
                                            <div className='flex gap-1'>
                                                <img src={heart_icon} alt="likes"  className='w-5 hover:scale-75'/>
                                                <p>{photo.likes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )): ""}
                            
                        </div>
        </InfiniteScroll>
                {/* {photos && (
                    <div className='text-center mt-4 mb-12 '>
                        {page > 1 ? (
                            <button onClick={() => setPage(page- 1)}
                            className='bg-red-500 hover:bg-red-800 hover:cursor-pointer border-none py-2 px-4 text-white font-medium rounded-lg m-4'
                            >Previous</button>
                        ):(
                            <button disabled
                            className='bg-red-300 border-none py-2 px-4 text-white font-medium rounded-lg m-4'
                            >Previous</button>
                        )}
                        <button onClick={() => setPage(page + 1)} 
                        className='bg-indigo-500 hover:bg-indigo-800 hover:cursor-pointer border-none py-2 px-4 text-white font-medium rounded-lg m-4'>Next</button>
                    </div>
                )}
     */}
    {/* 👇️ scroll to top on button click */}
    {scrollBtn && (
        <div className='animate-bounce bottom-10 right-10 fixed p-7 bg-slate-300 rounded-full hover:cursor-pointer' onClick={handleScrollToTop}>
            <img src={up_icon} alt=""  
            className=' w-6' />
        </div>
          
        )}
    </div>
  )
}

export default PhotoGallery