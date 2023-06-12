import React, { useState, useEffect } from 'react';
import personService from './services/persons';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';

const App = () => {
  // State variables
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  // Effect hook to fetch initial data from the server
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  // Event handler for adding a new person
  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    // Check if the person already exists in the phonebook
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      // Ask for confirmation to update the number
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Replace the old number with a new one?`
        )
      ) {
        personService
          .update(existingPerson.id, personObject)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === updatedPerson.id ? updatedPerson : person
              )
            );
            setNewName('');
            setNewNumber('');
            setNotification({
              message: `Updated ${updatedPerson.name}`,
              type: 'success',
            });
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch((error) => {
            setNotification({
              message: `Error updating ${existingPerson.name}`,
              type: 'error',
            });
            setTimeout(() => {
              setNotification(null);
            }, 5000);
            console.log(error);
          });
      }
    } else {
      // Add a new person to the phonebook
      personService
        .create(personObject)
        .then((newPerson) => {
          setPersons([...persons, newPerson]);
          setNewName('');
          setNewNumber('');
          setNotification({
            message: `Added ${newPerson.name}`,
            type: 'success',
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          setNotification({
            message: `Error adding ${personObject.name}`,
            type: 'error',
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
          console.log(error);
        });
    }
  };

  // Event handler for deleting a person
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({
            message: `Deleted ${name}`,
            type: 'success',
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          setNotification({
            message: `Error deleting ${name}`,
            type: 'error',
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
          console.log(error);
        });
    }
  };

  // Event handler for name input change
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  // Event handler for number input change
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // Event handler for filter input change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filter the persons based on the filter value
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
