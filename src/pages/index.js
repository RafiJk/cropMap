
import { useState, useEffect } from 'react'; //use is a hook...hooks are like instance variabels
import Link from 'next/link';  //Link gives you lin k abilities
import { useRouter } from 'next/router'; //again navigation stuff 


const HomePage = () => {
 const [searchTerm, setSearchTerm] = useState('');  // a blank string 
 const router = useRouter();


 useEffect(() => {
   const handleKeyDown = (event) => {
     if (event.key === 'Enter') {
       const lowerCaseSearchTerm = searchTerm.toLowerCase();
       if (lowerCaseSearchTerm === 'wheat') {
         router.push('/crop/wheat');
       } else if (lowerCaseSearchTerm === 'corn') {
         router.push('/crop/corn');
       } else if (lowerCaseSearchTerm === 'soybean') {
         router.push('/crop/soybean');
       }
     }
   };


   document.addEventListener('keydown', handleKeyDown);


   return () => {
     document.removeEventListener('keydown', handleKeyDown);
   };
 }, [searchTerm, router]);


 const handleChange = (event) => {
   setSearchTerm(event.target.value);
 };


 return (
   <div>
     <nav>
       <Link href="/">Home</Link>

       <Link href="/addMapDate">Update Harvest</Link>

       {/* <Link href="/front_harvest">realupdate</Link> */}
     </nav>
     <h1>Home Page</h1>
     <input
       type="text"
       placeholder="Search Wheat, Soybean, or Corn"
       value={searchTerm}
       onChange={handleChange}
     />
     {searchTerm && (
       <p>
         You have typed: {searchTerm}
         {/* Redirect or navigate to the respective crop page here */}
       </p>
     )}
   </div>
 );
};


export default HomePage;



