import './App.css';
import ContactsGraphWithAggregatedCalculations from './components/ContactsGraphWithAggregatedCalculations';
// import ContactsGraphWithSeverRequests from './components/ContactsGraphWithSeverRequests';

function App() {
  return (
    <div className="App">
      {/* <ContactsGraphWithSeverRequests /> */}
      <ContactsGraphWithAggregatedCalculations />
    </div>
  );
}

export default App;
