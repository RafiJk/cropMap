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
       <Link href="/harvest">Update Harvest</Link>
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





// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import Autosuggest from 'react-autosuggest';
// import { useRouter } from 'next/router';

// interface Suggestion {
//   id: number;
//   value: string;
// }

// const suggestions: Suggestion[] = [
//   { id: 1, value: 'Soybean' },
//   { id: 2, value: 'Corn' },
//   { id: 3, value: 'Wheat' },
// ];

// const HomePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestionsList, setSuggestionsList] = useState<Suggestion[]>([]);
//   const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
//   const router = useRouter();
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (selectedSuggestion) {
//       const { value } = selectedSuggestion;
//       setSearchTerm(value);
//     }
//   }, [selectedSuggestion]);

//   const handleSearch = (
//     event: React.FormEvent<any>, 
//     { newValue }: { newValue: string }
//   ) => {
//     setSearchTerm(newValue);
//   };

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter' && suggestionsList.length > 0) {
//       setSelectedSuggestion(suggestionsList[0]);
//       router.push(`/crop/${suggestionsList[0].value}`);
//     }
//   };

//   const getSuggestions = (value: string) => {
//     const inputValue = value.trim().toLowerCase();
//     const inputLength = inputValue.length;
//     return inputLength === 0
//       ? []
//       : suggestions.filter(
//           (suggestion) => suggestion.value.toLowerCase().slice(0, inputLength) === inputValue
//         );
//   };

//   const renderSuggestion = (suggestion: Suggestion) => {
//     return <div>{suggestion.value}</div>;
//   };

//   const onSuggestionsFetchRequested = ({ value }: Autosuggest.SuggestionsFetchRequestedParams) => {
//     setSuggestionsList(getSuggestions(value));
//   };

//   const onSuggestionsClearRequested = () => {
//     setSuggestionsList([]);
//   };

//   const getSuggestionValue = (suggestion: Suggestion) => suggestion.value;

//   const onSuggestionSelected = (
//     event: React.FormEvent,
//     { suggestion }: Autosuggest.SuggestionSelectedEventData<Suggestion>
//   ) => {
//     setSelectedSuggestion(suggestion);
//     router.push(`/crop/${suggestion.value}`);
//   };

//   // const inputProps: Autosuggest.InputProps<Suggestion> = {
//   //   placeholder: 'Search Wheat, Soybean, or Corn',
//   //   value: searchTerm,
//   //   onChange: handleSearch,
//   //   onKeyDown: handleKeyDown,
//   // };

//   return (
//     <div>
//       <nav>
//         <Link href="/">Home</Link>
//       </nav>
//       <h1>Home Page</h1>
//       {/* <Autosuggest<Suggestion>
//         suggestions={suggestionsList}
//         onSuggestionsFetchRequested={onSuggestionsFetchRequested}
//         onSuggestionsClearRequested={onSuggestionsClearRequested}
//         getSuggestionValue={getSuggestionValue}
//         renderSuggestion={renderSuggestion}
//         inputProps={inputProps}
//         onSuggestionSelected={onSuggestionSelected}
//         alwaysRenderSuggestions
//         inputRef={inputRef}
//       /> */}
//       {selectedSuggestion && (
//         <p>
//           You have selected: {selectedSuggestion.value}
//         </p>
//       )}
//     </div>
//   );
// };

// export default HomePage;
