import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../global.css'; 
import './App.css'; 
import { Person, Film, Planet, Species, Starship, Vehicle } from '../types'; 

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<{ [key: string]: (Person | Film | Planet | Species | Starship | Vehicle)[] }>({}); 
  const [autocompleteResults, setAutocompleteResults] = useState<(Person | Film | Planet | Species | Starship | Vehicle)[]>([]); 
  const [searchTriggeredByAutocomplete, setSearchTriggeredByAutocomplete] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchTriggeredByAutocomplete(false); 
  };

  useEffect(() => {
    if (query.length > 0 && !searchTriggeredByAutocomplete) {
      const fetchAutocomplete = async () => {
        const endpoints = ['people', 'films', 'planets', 'species', 'starships', 'vehicles'];
        const promises = endpoints.map(endpoint =>
          axios.get<{ results: (Person | Film | Planet | Species | Starship | Vehicle)[] }>(`https://swapi.dev/api/${endpoint}/?search=${query}`)
        );

        try {
          const responses = await Promise.all(promises);
          const newAutocompleteResults: (Person | Film | Planet | Species | Starship | Vehicle)[] = [];
          responses.forEach(response => {
            newAutocompleteResults.push(...response.data.results.slice(0, 5));
          });
          setAutocompleteResults(newAutocompleteResults.slice(0, 5)); 
        } catch (error) {
          console.error('Error fetching autocomplete data:', error);
        }
      };

      fetchAutocomplete();
    } else {
      setAutocompleteResults([]);
    }
  }, [query, searchTriggeredByAutocomplete]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const fetchData = async () => {
        const endpoints = ['people', 'films', 'planets', 'species', 'starships', 'vehicles'];
        const promises = endpoints.map(endpoint =>
          axios.get<{ results: (Person | Film | Planet | Species | Starship | Vehicle)[] }>(`https://swapi.dev/api/${endpoint}/?search=${searchTerm}`) // Update response type
        );

        try {
          const responses = await Promise.all(promises);
          const newResults: { [key: string]: (Person | Film | Planet | Species | Starship | Vehicle)[] } = {}; 
          responses.forEach((response, index) => {
            const endpoint = endpoints[index];
            newResults[endpoint] = response.data.results.slice(0, 3);
          });
          console.log('Fetched data:', newResults); 
          setResults(newResults);
          setAutocompleteResults([]); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    } else {
      setResults({});
    }
  };

  const handleResultClick = (category: string) => {
    navigate(`/category?category=${category}&search=${query}`);
  };

  const handleAutocompleteClick = (result: Person | Film | Planet | Species | Starship | Vehicle) => { // Update parameter type
    const searchTerm = 'name' in result ? result.name : 'title' in result ? result.title : '';
    setQuery(searchTerm);
    setAutocompleteResults([]);
    setSearchTriggeredByAutocomplete(true); // Set the flag to true
    handleSearch(searchTerm);
  };

  return (
    <div className="container">
      <div className='title'>
        <div className='logo'></div>
      <h1>Search</h1>
      </div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="What do you seek..."
      />
      <button onClick={() => { handleSearch(query); setAutocompleteResults([]); }} disabled={!query.trim()}>Go</button>
      {autocompleteResults.length > 0 && (
        <div id="autocomplete-results">
          {autocompleteResults.map((result, index) => (
            <div key={index} onClick={() => handleAutocompleteClick(result)}>
              {'name' in result ? result.name : 'title' in result ? result.title : ''}
            </div>
          ))}
        </div>
      )}
      <div id="search-results">
        {Object.keys(results).map(category => (
          <div key={category}>
            <h3>{category}</h3>
            {results[category].map((result, index) => (
              <div key={index}>
                {'name' in result ? result.name : 'title' in result ? result.title : ''}
              </div>
            ))}
            <button className='hollow' onClick={() => handleResultClick(category)}>View All</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;