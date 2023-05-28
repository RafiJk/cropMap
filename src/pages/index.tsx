import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import Autosuggest, { ChangeEvent as AutosuggestChangeEvent } from 'react-autosuggest';
import { useRouter } from 'next/router';

interface Suggestion {
  id: number;
  value: string;
}

const suggestions: Suggestion[] = [
  { id: 1, value: 'PESTA' },
  { id: 2, value: 'PESTB' },
  { id: 3, value: 'PESTC' },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestionsList, setSuggestionsList] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedSuggestion) {
      const { value } = selectedSuggestion;
      setSearchTerm(value);
    }
  }, [selectedSuggestion]);

  const handleSearch = (event: AutosuggestChangeEvent, { newValue }: Autosuggest.ChangeEvent) => {
    setSearchTerm(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && suggestionsList.length > 0) {
      setSelectedSuggestion(suggestionsList[0]);
      router.push(`/pest/${suggestionsList[0].value}`);
    }
  };

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : suggestions.filter(
          (suggestion) => suggestion.value.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const renderSuggestion = (suggestion: Suggestion) => {
    return <div>{suggestion.value}</div>;
  };

  const onSuggestionsFetchRequested = ({ value }: Autosuggest.SuggestionsFetchRequestedParams) => {
    setSuggestionsList(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestionsList([]);
  };

  const getSuggestionValue = (suggestion: Suggestion) => suggestion.value;

  const onSuggestionSelected = (
    event: React.FormEvent,
    { suggestion }: Autosuggest.SuggestionSelectedEventData<Suggestion>
  ) => {
    setSelectedSuggestion(suggestion);
    router.push(`/pest/${suggestion.value}`);
  };

  const inputProps: Autosuggest.InputProps<Suggestion> = {
    placeholder: 'Search PESTA, PESTB, or PESTC',
    value: searchTerm,
    onChange: handleSearch as (event: ChangeEvent<HTMLInputElement>) => void,
    onKeyDown: handleKeyDown,
  };

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
      </nav>
      <h1>Home Page</h1>
      <Autosuggest<Suggestion>
        suggestions={suggestionsList}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        alwaysRenderSuggestions
        inputRef={inputRef}
      />
      {selectedSuggestion && (
        <p>
          You have selected: {selectedSuggestion.value}
          {/* Redirect or navigate to the selected suggestion's page here */}
        </p>
      )}
    </div>
  );
};

export default HomePage;
