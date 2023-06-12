import React, { useState, useEffect } from 'react';
import personService from './phonebookService';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = event => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    };

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        displayError(`Added ${returnedPerson.name}`);
      })
      .catch(error => {
        displayError(error.response.data.error);
      });
  };

  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const displayError = message => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>

      <h3>Add a new</h3>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={event => setNewName(event.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={event => setNewNumber(event.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      {filteredPersons.map(person =>
        <div key={person.id}>{person.name} {person.number}</div>
      )}

      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
};

export default App;
