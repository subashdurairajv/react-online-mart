import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const ShopGridwall: React.FC = () => {
    const [products, SetProducts] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const fetchProducts = async () => {
        const response = await fetch('http://localhost:5000/api/fetchProducts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response
    }

    useEffect(() => {
        try {
            const data = fetchProducts()

        } catch (error) {
            console.log('error', error)
        }
    }, [])
    //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log('Login Attempt:', { userName, password });
    //     try {
    //         const response = await fetch('http://localhost:5000/api/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ username: userName, password })
    //         });

    //         const data = await response.json();
    //         if (data.success) {
    //             alert("Login Successful!");
    //         } else {
    //             alert("Login Failed: " + data.message);
    //         }
    //     } catch (err) {
    //         console.error("Connection error", err);
    //     }
    //   };

    return (
        <Container className="mt-5">
            <img src='https://www.freeiconspng.com/thumbs/iphone-x-pictures/apple-iphone-x-pictures-5.png' alt='Image' />

            <Row className="justify-content-md-center">
                <Col xs={12} md={6} lg={4} className='mb-4'>
                    <Card className="shadow-sm">
                        <Card.Title className="p-2">
                            <h1 className="text-center mb-4">Phone</h1>
                        </Card.Title>
                        <Card.Img>
                        </Card.Img>
                        <Card.Body className="p-4">
                            <p className="text-center mb-4">Description</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ShopGridwall;