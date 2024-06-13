import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import './Header.css'; // Import custom CSS for header styling

function Header({ OpenSidebar, stocksData }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (stocksData === null) {
            fetch('http://127.0.0.1:5000/backup')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch backup data');
                    }
                    return response.json();
                })
                .then(backupData => {
                    setData(backupData);
                })
                .catch(error => {
                    console.error('Error fetching backup data:', error);
                });
        } else {
            setData(stocksData);
        }
    }, [stocksData]);

    // Filtered results based on search query
    const filteredResults = data
        ? data.filter(stock =>
            stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleStockClick = (stock) => {
        navigate('/analysis', { state: { symbol: stock.symbol } });
    };

    return (
        <header className='header'>
            <div className='header-search'>
                <div className="search-bar">
                    <BsSearch className="search-icon" />
                    <TextField
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={handleSearch}
                        variant='outlined'
                        size='small'
                        className="search-input"
                    />
                </div>
                {searchQuery && (
                    <div className="search-results">
                        <List>
                            {filteredResults.map(stock => (
                                <React.Fragment key={stock.symbol}>
                                    <ListItem onClick={() => handleStockClick(stock)}>
                                        <ListItemText primary={stock.name} secondary={stock.symbol} />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </div>
                )}
            </div>
            <div className='header-right'>
                <BsFillBellFill className='icon' />
                <BsFillEnvelopeFill className='icon' />
                <BsPersonCircle className='icon' />
            </div>
        </header>
    );
}

export default Header;
