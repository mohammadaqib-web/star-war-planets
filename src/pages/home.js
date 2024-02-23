import React, { useEffect, useState } from 'react';
import './home.css';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState([]);
    const [residentdata, setResidentdata] = useState([]);
    const [prev, setPrev] = useState('');
    const [nex, setNex] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchResidentsData = async () => {
            if (data.length > 0) {
                const residentDataArray = await Promise.all(data.map(async (item) => {
                    const residents = await Promise.all(item.residents.map(async (resident) => {
                        const response = await axios.get(resident);
                        return response.data;
                    }));
                    return residents;
                }));
                setResidentdata(residentDataArray);
            }
        };

        fetchResidentsData();
    }, [data]);

    const fetchData = async () => {
        try {
            const resp = await axios.get("https://swapi.dev/api/planets/?format=json");
            setData(resp.data.results);
            setPrev(resp.data.previous);
            setNex(resp.data.next);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const previous = async() => {
        const prevAPI = await axios.get(`${prev}`);
        setData(prevAPI.data.results);
        setPrev(prevAPI.data.previous);
        setNex(prevAPI.data.next);
     }

    const next = async() => { 
        const nextAPI = await axios.get(`${nex}`);
        setData(nextAPI.data.results);
        setPrev(nextAPI.data.previous);
        setNex(nextAPI.data.next);
    }

    return (
        <div className='card-group'>
            {data.map((item, index) => (
                <div className='card' key={index}>
                    <h1 style={{ textDecoration: "underline gold" }}>{item.name}</h1>
                    <h4>Residents Info:</h4>
                    <div className='Resdata'>
                        {residentdata[index] && residentdata[index].length > 0 ? (
                            residentdata[index].map((resident, idx) => (
                                <div key={idx}>
                                    <h5>{resident.name}</h5>
                                    <p><span>Height: </span>{resident.height}</p>
                                    <p><span>Mass: </span>{resident.mass}</p>
                                    <p><span>Gender: </span>{resident.gender}</p>
                                </div>
                            ))
                        ) : (
                            <div>There are no residents</div>
                        )}
                    </div>
                </div>
            ))}
            <div>
                {prev == null ? "" :
                    <button type='button' className='btn' onClick={previous}><span className='text-btn'>Prev</span></button>
                }
                {nex == null ? "" :
                    <button type='button' className='btn' onClick={next}><span className='text-btn'>Next</span></button>
                }
            </div>
        </div>
    );
}

export default Home;
