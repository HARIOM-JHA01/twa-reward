import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk'; // Telegram Web App SDK
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

interface User {
  firstName: string;
  lastName: string;
  username: string;
  country: string | null;
  language: string;
}

function App() {
  const [count, setCount] = useState<number>(0);
  const [country, setCountry] = useState<string | null>(null);
  const [userData, setUserData] = useState<User>({
    firstName: 'Unknown',
    lastName: '',
    username: 'Unknown',
    country: null,
    language: 'Unknown',
  });
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Telegram WebApp
    WebApp.ready();

    // Extract initData from Telegram
    const initDataUnsafe: any = WebApp.initDataUnsafe;

    // Extract available user data
    const user: User = {
      firstName: initDataUnsafe?.user?.first_name || 'Unknown',
      lastName: initDataUnsafe?.user?.last_name || '',
      username: initDataUnsafe?.user?.username || 'Unknown',
      country: initDataUnsafe?.user?.country || null,
      language: initDataUnsafe?.user?.language_code || 'Unknown',
    };

    setUserData(user);

    // Check for missing data
    if (!user.country) {
      setShowPrompt(true); // Show prompt if country is missing
    } else {
      setCountry(user.country);
    }
  }, []);

  const handleCountrySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const userInputCountry = (form.elements.namedItem('country') as HTMLInputElement).value.trim();
    setCountry(userInputCountry);
    setShowPrompt(false); // Hide the prompt after submission
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Telegram WebApp</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </div>
      <div className="card">
        <button
          onClick={() =>
            WebApp.showAlert(`Hello! Count is ${count}. Your country: ${country || 'Not provided'}`)
          }
        >
          Show Alert
        </button>
      </div>
      <div>
        <p><strong>User Info:</strong></p>
        <p>First Name: {userData?.firstName}</p>
        <p>Last Name: {userData?.lastName}</p>
        <p>Username: {userData?.username}</p>
        <p>Language: {userData?.language}</p>
        <p>Country: {country || 'Not available'}</p>
      </div>
      {showPrompt && (
        <div>
          <h2>We need your country information!</h2>
          <form onSubmit={handleCountrySubmit}>
            <label>
              Enter your country:
              <input type="text" name="country" required placeholder="Your country" />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
