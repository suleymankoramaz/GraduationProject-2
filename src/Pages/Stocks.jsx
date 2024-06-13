import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Stocks = ({ stocksData }) => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(stocksData);
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

    const handleRowClick = (stock) => {
        navigate('/analysis', { state: { symbol: stock.symbol } });
    };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>Stocks</h3>
            </div>
            <div className="container">
                <TableContainer component={Paper} className="tableContainer">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Open</TableCell>
                                <TableCell>Close</TableCell>
                                <TableCell>Volume</TableCell>
                                <TableCell>Potential Profit/Loss</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.map((stock, index) => (
                                <TableRow key={index} className="tableRow" onClick={() => handleRowClick(stock)}>
                                    <TableCell>
                                        {stock.name}
                                    </TableCell>
                                    <TableCell>{stock.symbol}</TableCell>
                                    <TableCell>{stock.price}</TableCell>
                                    <TableCell>{stock.open}</TableCell>
                                    <TableCell>{stock.close}</TableCell>
                                    <TableCell>{stock.volume}</TableCell>
                                    <TableCell>{stock.potential_profit_loss}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </main>
    );
}

export default Stocks;
