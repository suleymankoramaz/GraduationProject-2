import React, { useState, useEffect } from 'react';
import { tsvParse, timeParse } from 'd3';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Chart from '../components/Chart';
import { getData } from '../components/utils';

function Home() {

    const [data, setData] = useState(null);

    useEffect(() => {
        getData("http://127.0.0.1:5000/stock_yearly/XU100.IS").then(data => {
            setData(data)
        })
    }, [])


    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>Home</h3>
            </div>
            <div className='home-chart-container'>
                {data && <Chart data={data} width={1500} height={600} />}
            </div>
        </main>
    )
}

export default Home;
