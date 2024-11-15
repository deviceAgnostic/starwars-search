import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../global.css';
import './CategoryPage.css';
import { Person } from '../types';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CategoryPage: React.FC = () => {
  const [results, setResults] = useState<Person[]>([]);
  const [newCharacter, setNewCharacter] = useState<Partial<Person>>({
    name: '',
    birth_year: '',
    gender: '',
    hair_color: '',
    mass: '',
    eye_color: '',
    height: '',
    skin_color: ''
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Person>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const query = useQuery();
  const category = query.get('category');
  const search = query.get('search');
  const navigate = useNavigate();

  useEffect(() => {
    if (category && search) {
      const fetchData = async () => {
        try {
          const response = await axios.get<{ results: Person[] }>(`https://swapi.dev/api/${category}/?search=${search}`);
          console.log('Fetched category data:', response.data.results);
          setResults(response.data.results);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [category, search]);

  const handleDelete = (index: number) => {
    const newResults = [...results];
    newResults.splice(index, 1);
    setResults(newResults);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditValues({ ...results[index] });
  };

  const handleSave = (index: number) => {
    const newResults = [...results];
    newResults[index] = editValues as Person;
    setResults(newResults);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditValues({});
  };

  const handleChange = (field: keyof Person, value: string) => {
    setEditValues({ ...editValues, [field]: value });
  };

  const handleNewCharacterChange = (field: keyof Person, value: string) => {
    setNewCharacter({ ...newCharacter, [field]: value });
  };

  const handleCreate = () => {
    const newResults = [...results, newCharacter as Person];
    setResults(newResults);
    setNewCharacter({
      name: '',
      birth_year: '',
      gender: '',
      hair_color: '',
      mass: '',
      eye_color: '',
      height: '',
      skin_color: ''
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (category !== 'people') {
    return (
      <div className="resultsContainer">
        <div className='topBar'>
          <button className='back' onClick={() => navigate(-1)}></button>
          <h1>{category} Results</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="resultsContainer">
      <div className='topBar'>
        <button className='back' onClick={() => navigate(-1)}></button>
        <h1>{category} Results</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth Year</th>
            <th>Gender</th>
            <th>Hair Color</th>
            <th>Mass</th>
            <th>Eye Color</th>
            <th>Height</th>
            <th>Skin Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                ) : (
                  result.name
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.birth_year || ''}
                    onChange={(e) => handleChange('birth_year', e.target.value)}
                  />
                ) : (
                  result.birth_year
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  />
                ) : (
                  result.gender
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.hair_color || ''}
                    onChange={(e) => handleChange('hair_color', e.target.value)}
                  />
                ) : (
                  result.hair_color
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.mass || ''}
                    onChange={(e) => handleChange('mass', e.target.value)}
                  />
                ) : (
                  result.mass
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.eye_color || ''}
                    onChange={(e) => handleChange('eye_color', e.target.value)}
                  />
                ) : (
                  result.eye_color
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.height || ''}
                    onChange={(e) => handleChange('height', e.target.value)}
                  />
                ) : (
                  result.height
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editValues.skin_color || ''}
                    onChange={(e) => handleChange('skin_color', e.target.value)}
                  />
                ) : (
                  result.skin_color
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <>
                  <div className='editActions'>
                    <button className='close action' onClick={handleCancel}></button>
                    <button className='hollow' onClick={() => handleSave(index)}>Save</button>
                    </div>
                  </>
                ) : (
                  <>
                    <button className='edit action' onClick={() => handleEdit(index)}></button>
                    <button className='delete action' onClick={() => handleDelete(index)}></button>
                  </>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                value={newCharacter.name || ''}
                onChange={(e) => handleNewCharacterChange('name', e.target.value)}
                placeholder="Name"
              />
            </td>
            <td>
              <input
                type="text"
                value={newCharacter.birth_year || ''}
                onChange={(e) => handleNewCharacterChange('birth_year', e.target.value)}
                placeholder="Birth Year"
              />
            </td>
            <td>
              <input
                type="text"
                value={newCharacter.gender || ''}
                onChange={(e) => handleNewCharacterChange('gender', e.target.value)}
                placeholder="Gender"
              />
            </td>
            <td>
              <input
                type="text"
                value={newCharacter.hair_color || ''}
                onChange={(e) => handleNewCharacterChange('hair_color', e.target.value)}
                placeholder="Hair Color"
              />
            </td>
            <td>
              <input
                type="text"
                value={newCharacter.mass || ''}
                onChange={(e) => handleNewCharacterChange('mass', e.target.value)}
                placeholder="Mass"
              />
            </td>
            <td>
              <input
                type="text"
                value={newCharacter.eye_color || ''}
                onChange={(e) => handleNewCharacterChange('eye_color', e.target.value)}
                placeholder="Eye Color"
              />
            </td>
            <td>
              <input
                type="text"
                value={newCharacter.height || ''}
                onChange={(e) => handleNewCharacterChange('height', e.target.value)}
                placeholder="Height"
              />
            </td>
            <td>
              <input
                type="text"
                value={newCharacter.skin_color || ''}
                onChange={(e) => handleNewCharacterChange('skin_color', e.target.value)}
                placeholder="Skin Color"
              />
            </td>
            <td>
              <button className='hollow' onClick={handleCreate} disabled={!newCharacter.name?.trim()}>Create</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CategoryPage;