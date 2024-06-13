import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import Stocks from './Pages/Stocks';
import Saved from './Pages/Saved';

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [stocksData, setStocksData] = useState(null);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        // Fetch data from the API when component mounts or refreshes
        console.log('Fetching data...')
        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:5000/stocks');
                const data = await response.json();
                // Save response data to local storage
                localStorage.setItem('bist100_stocks', JSON.stringify(data));
                // Set the stocks data state
                setStocksData(data);
                console.log('Successfully fetched data!')
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }


        fetchData(); // Call the function to fetch data
    }, []); // Empty dependency array to ensure it runs only once on mount or refresh

    return (
        <Router>
            <div className='grid-container'>
                <Header OpenSidebar={OpenSidebar} stocksData={stocksData} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/stocks" element={<Stocks stocksData={stocksData} />} />
                    <Route path="/saved" element={<Saved />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
