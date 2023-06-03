import React, { useState, useEffect } from 'react';
import firebase from './firebase';

const App = () => {

   // zdefiniowanie stanu aplikacji, danych na których będziemy pracowali
  const [people, setPeople] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editPerson, setEditPerson] = useState(null);

  // Wywołanie funkcji fetchData przy pierwszym renderowaniu komponentu
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const db = firebase.firestore();
    const data = await db.collection('people').get();
    // Aktualizacja stanu people za pomocą otrzymanych danych
    setPeople(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addPerson = async () => {
    const db = firebase.firestore();
     // Tryb edycji do aktualizacji danych 
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
       // Dodanie nowej osoby do bazy danych
      await db.collection('people').add({
        firstName,
        lastName,
        phoneNumber,
        address,
      });
    }
    // Wyczyszczenie pól po dodaniu lub edycji osoby i aktualizacja danych metodą fetchData()
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setAddress('');
    fetchData();
  };

  const deletePerson = async (id) => {
    const db = firebase.firestore();
    // Usunięcie osoby z bazy danych - funkcja asynchroniczna i aktualizacja danych metodą fetchData()
    await db.collection('people').doc(id).delete();
    fetchData();
  };

  const editSelectedPerson = (person) => {
    // Ustawienie trybu edycji i edycja danych
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

    // warunkowe wyszukiwanie na podstawie wybranego pola input

    if (searchLastName) {
      query = query.where('lastName', '==', searchLastName);
    }

    if (searchAddress) {
      query = query.where('address', '==', searchAddress);
    }
    // Aktualizacja stanu people zwrócona z wyszukiwania
    const data = await query.get();
    setPeople(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className='container'>
      <h2>CRUD App</h2>
      <p>Aplikacja typu CRUD napisania w React.js z pomocą Firestore Database, która jest bazą danych typu NoSQL. Dane w bazie są trzymane w postaci dokumentów, które następnie łączymy w kolekcje. 
      Po wejściu na stronę jest widoczna aktualna lista dodanych osób w bazie danych. 
      
      Możemy dodać nowe osoby uzupełniając pola input i klikając w przycisk "dodaj", nowa osoba pojawi się na liście. 
      Edycja i usuwanie działa analogicznie. Wyszukiwanie osób w bazie danych może odbywać się po nazwisku lub miejscowości, która jest przypisana.
      Za pomocą buttona "Odśwież" możemy przeładować stronę np po wyszukaniu danych.</p>
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
        <button type="button" class="btn btn-success" onClick={refreshPage}>Odśwież</button>
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