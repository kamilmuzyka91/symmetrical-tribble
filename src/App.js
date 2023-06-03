import React, { useState, useEffect } from 'react';
import firebase from './firebase';

const App = () => {
  const [people, setPeople] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

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
    await db.collection('people').add({
      firstName,
      lastName,
      phoneNumber,
      address,
    });
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

  const editPerson = async (id) => {
    const db = firebase.firestore();
    await db.collection('people').doc(id).update({
      firstName,
      lastName,
      phoneNumber,
      address,
    });
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setAddress('');
    fetchData();
  };

  const searchPerson = async () => {
    const db = firebase.firestore();
    const query = await db
      .collection('people')
      .where('lastName', '==', lastName)
      .get();
    setPeople(query.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div>
      <h1>CRUD App</h1>
      <div>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <button onClick={addPerson}>Add Person</button>
        <button onClick={searchPerson}>Search by Last Name</button>
      </div>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            {person.firstName} {person.lastName}, {person.phoneNumber}, {person.address}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
            <button onClick={() => editPerson(person.id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;