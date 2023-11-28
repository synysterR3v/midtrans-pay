import { Box, Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from "axios";

const Home = () => {
    const [name, setName] = useState("");
    const [order_id, setOrder_id] = useState("");
    const [total, setTotal] = useState(0);
    const [token, setToken] = useState("");

    const process = async () => {
        const data = {
            nama: name,
            order_id: order_id,
            total: parseFloat(total)
        };
        console.log(data);
        const config = {
            headers: {
                "Content-Type" : "application/json"
            }
        }

        const response = await axios.post("http://localhost:1000/api/payment/process-transaction", data, config)

        setToken(response.data.token);
    };

    useEffect(()=> {
        if (token) {
            window.snap.pay(token, {
                onSuccess: (result) => {
                    localStorage.setItem("Pembayaran", JSON.stringify(result))
                    setToken("");
                },
                onPending: (result) => {
                    localStorage.setItem("Pembayaran", JSON.stringify(result))
                    setToken("");
                },
                onError: (result) => {
                    console.log(error)
                    setToken("");
                },
                onClose: (result) => {
                    console.log("Anda Belum Menyelesaikan Pembayaran")
                    setToken("");
                }

            })

            setName("");
            setOrder_id("");
            setTotal("");
        }
    }, [token])

    useEffect(() => {
        const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        let scriptTag = document.createElement("script")
        scriptTag.src = midtransUrl

        const midtransClientKey = "SB-Mid-client-Yf_Ff27MJAT4sAKU";
        scriptTag.setAttribute("data-client-key", midtransClientKey)

        document.body.appendChild(scriptTag)

        return ()=>{
            document.body.removeChild(scriptTag)
        }
    })

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '50vw', padding: 4 }}>
            <TextField type='text' label='Nama' value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
            <TextField type='text' label='Order ID' value={order_id} onChange={(e) => setOrder_id(e.target.value)} sx={{ mb: 2 }} />
            <TextField type='number' label='Total' value={total} onChange={(e) => setTotal(e.target.value)} sx={{ mb: 2 }} />

            <Box>
                <Button onClick={process} variant='outlined'>
                    Proses Bayar
                </Button>
            </Box>
        </Box>
    );
};

export default Home;



