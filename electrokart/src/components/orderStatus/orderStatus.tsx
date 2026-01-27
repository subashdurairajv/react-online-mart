import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { userInfo } from '../store/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

const OrderStatus: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const { data: { success = false }, orderId = '' } = location.state || {};


    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow border-0 text-center p-4 mt-5">
                        <Card.Body>
                            <div className="mb-4">
                                <h1 className="display-1 text-success mt-2">
                                    {success === true ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle-fill"></i>}                        </h1>
                            </div>

                            <h2 className="fw-bold mb-3">{success === true ? "Order Placed Successfully!" : "Order Not placed!"}</h2>

                            <p className="text-muted mb-4">
                                {success === true ? "Your order has been confirmed. We've sent a receipt to your registered email address." : "Please try again after 5 minutes!"}
                            </p>

                            {success === true && <div className="bg-light border rounded p-3 mb-4">
                                <p className="small text-uppercase text-secondary mb-1">Order Reference</p>
                                <h5 className="mb-0 text-primary font-monospace">{orderId}</h5>
                            </div>
                            }

                            <div className="d-grid gap-3">
                                <Button
                                    variant="primary"
                                    className="py-2 fw-bold"
                                    onClick={() => navigate('/gridwall', { replace: true})}
                                >
                                    Continue Shopping
                                </Button>

                            </div>
                        </Card.Body>
                    </Card>

                    
                </Col>
            </Row>
        </Container>
    );
};

export default OrderStatus;