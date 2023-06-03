import React, { useState, useEffect } from 'react';
import firebase from './firebase';

const App = () => {
  const [people, setPeople] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editPerson, setEditPerson] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const db = firebase.firestore();
    const data = await db.collection('people').get();
    setPeople(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addPerson = async () => {
    const db = firebase.firestore();
    if (editMode) {
      await db.collection('people').doc(editPerson.id).update({
        firstName,
        lastName,
        phoneNumber,
        address,
      });
      setEditMode(false);
      setEditPerson(null);
    } else {
      await db.collection('people').add({
        firstName,
        lastName,
        phoneNumber,
        address,
      });
    }
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setAddress('');
    fetchData();
  };

  const deletePerson = async (id) => {
    const db = firebase.firestore();
    await db.collection('people').doc(id).delete();
    fetchData();
  };

  const editSelectedPerson = (person) => {
    setEditMode(true);
    setEditPerson(person);
    setFirstName(person.firstName);
    setLastName(person.lastName);
    setPhoneNumber(person.phoneNumber);
    setAddress(person.address);
  };

  const searchPeople = async () => {
    const db = firebase.firestore();
    let query = db.collection('people');

    if (searchLastName) {
      query = query.where('lastName', '==', searchLastName);
    }

    if (searchAddress) {
      query = query.where('address', '==', searchAddress);
    }

    const data = await query.get();
    setPeople(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className='container'>
      <h2>CRUD App</h2>
      <div>
      <div className="hoverClass">
        <label>
         <span className='data'>Imię:</span> 
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
        <span className='data'>Nazwisko:</span> 
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
        <span className='data'>Numer telefonu:</span> 
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <label>
        <span className='data'>Miasto:</span> 
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        {editMode ? (
          <button onClick={addPerson}>Zapisz</button>
        ) : (
          <button type="button" class="btn btn-success" onClick={addPerson}>Dodaj</button>
        )}
        <br />
        </div>
        <div className="hoverClass">
        <label>
        <span className='data'>Wyszukaj po nazwisku:</span> 
          <input
            type="text"
            value={searchLastName}
            onChange={(e) => setSearchLastName(e.target.value)}
          />
        </label>
        <label>
        <span className='data'>Wyszukaj po mieście:</span> 
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </label>
        <button class="btn btn-primary" onClick={searchPeople}>Wyszukaj</button>
        </div>
      </div>
      <br />
      <ul className='list-group'>
        {people.map((person) => (
          <li className='list-group-item' key={person.id}>
            {person.firstName} {person.lastName} {person.phoneNumber} {person.address}
            <button type="button" class="btn btn-info" onClick={() => editSelectedPerson(person)}>Edytuj</button>
            <button type="button" class="btn btn-danger" onClick={() => deletePerson(person.id)}>Usuń</button>
        
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;