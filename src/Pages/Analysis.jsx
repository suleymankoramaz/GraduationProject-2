import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Chart from '../components/Chart';
import { getData } from '../components/utils';
import {
    Card, CardContent, CardMedia, Typography, Modal, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, TablePagination,
    Button
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import './Analysis.css';
import { ascending } from 'd3';

const patterns = [
    {
        name: "Ascending Triangle",
        image: "src/assets/patterns/ascending-triangle.png",
        description: "An ascending triangle is a bullish chart pattern used in technical analysis.",
        usage: "This pattern is used to predict a breakout in the upward direction."
    },
    {
        name: "Triple Top",
        image: "src/assets/patterns/triple-top.png",
        description: "A triple top is a bearish chart pattern used in technical analysis.",
        usage: "This pattern indicates that the asset is facing significant resistance and may reverse downward."
    },
    {
        name: "Double Bottom",
        image: "src/assets/patterns/double-bottom.jpg",
        description: "A double bottom is a bullish chart pattern used in technical analysis.",
        usage: "This pattern suggests that the asset has found support at the lower price and may move upwards."
    },
    {
        name: "Head and Shoulders",
        image: "src/assets/patterns/head-and-shoulders-pattern.jpg",
        description: "The head and shoulders pattern is a bearish reversal pattern.",
        usage: "It indicates a trend reversal from bullish to bearish."
    },
    {
        name: "Bear Flag",
        image: "src/assets/patterns/bear-flag.png",
        description: "The bear flag is a bearish continuation pattern.",
        usage: "It indicates a brief consolidation followed by a continuation of the downtrend."
    },
    {
        name: "Bull Flag",
        image: "src/assets/patterns/bull-flag.png",
        description: "The bull flag is a bullish continuation pattern.",
        usage: "It indicates a brief consolidation followed by a continuation of the uptrend."
    },
    {
        name: "Rising Wedge",
        image: "src/assets/patterns/rising-fedge.png",
        description: "The rising wedge is a bearish reversal pattern.",
        usage: "It indicates a trend reversal from bullish to bearish."
    },
    {
        name: "Falling Wedge",
        image: "src/assets/patterns/falling-edge.png",
        description: "The falling wedge is a bullish reversal pattern.",
        usage: "It indicates a trend reversal from bearish to bullish."
    }
];


function Analysis() {
    const location = useLocation();
    const symbol = location.state ? location.state.symbol : null;
    const [data, setData] = useState(null);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const chartRef = useRef(null);
    const [shownPattern, setShownPattern] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = symbol
                ? await getData(`http://127.0.0.1:5000/stock_yearly/${symbol}`)
                : await getData("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv");
            setData(response);
        };

        fetchData();
    }, [symbol]);

    const handleCardClick = (pattern) => {
        setSelectedPattern(pattern);
    };

    const handleClose = () => {
        setSelectedPattern(null);
    };

    const handleShown = (pattern) => {
        setShownPattern(pattern);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page on search
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page on rows per page change
    };

    const filteredPatterns = patterns.filter(pattern =>
        pattern.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClick = () => {
        chartRef.current.node.addPattern(selectedPattern.name)
        handleShown(selectedPattern)
        handleClose()
    }
    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>Analysis</h3>
                <Typography variant="h6" className="patterns-title">Patterns</Typography>
            </div>
            <div className='content-container'>
                <div className='chart-container'>
                    {data && <Chart data={data} ref={chartRef} width={1100} height={600} />}
                    {shownPattern && <img src={shownPattern.image} alt="" />}
                </div>
                <div className='patterns-container'>

                    <TextField
                        placeholder='Search pattern'
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />
                    <TableContainer component={Paper} className="patterns-table-container">
                        <Table>
                            <TableBody>
                                {filteredPatterns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pattern, index) => (
                                    <TableRow key={index} onClick={() => handleCardClick(pattern)}>
                                        <TableCell className="pattern-cell">
                                            <Card className="pattern-card">
                                                <CardMedia
                                                    component="img"
                                                    image={pattern.image}
                                                    alt={pattern.name}
                                                    className='pattern-image'
                                                />
                                                <CardContent>
                                                    <Typography variant="body2">{pattern.name}</Typography>
                                                </CardContent>
                                            </Card>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[3, 6, 9]}
                        component="div"
                        count={filteredPatterns.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
            <Modal
                open={!!selectedPattern}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className='modal-content'>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        className='modal-close-button'
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedPattern && (
                        <>
                            <img src={selectedPattern.image} alt={selectedPattern.name} className='modal-image' />
                            <Typography variant="h6" id="modal-title">
                                {selectedPattern.name}
                            </Typography>
                            <Typography id="modal-description">
                                {selectedPattern.description}
                            </Typography>
                            <Typography>
                                Usage: {selectedPattern.usage}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleClick()}
                            >
                                Add Pattern
                            </Button>
                        </>
                    )}
                </div>
            </Modal>

        </main>
    );
}

export default Analysis;