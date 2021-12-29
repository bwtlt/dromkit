import React from 'react';
import Sequencer from './components/sequencer';

const App = function () {
  const audioContext = new AudioContext();

  return (
    <div className="App">
      <header className="App-header">
        <h1>DROMKIT</h1>
        <h2>Online drum machine</h2>
      </header>
      <div className="app-body">
        <Sequencer audioContext={audioContext} />
      </div>
      <footer className="fixed-bottom">
        Dev by
        { ' ' }
        <a href="https://bwatelet.fr">bwatelet.fr</a>
      </footer>
    </div>
  );
};

export default App;
