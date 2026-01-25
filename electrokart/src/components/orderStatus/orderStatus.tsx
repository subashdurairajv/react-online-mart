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

  const { success } = location.state || {}; 

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (success === true) {
      setMessage('Order Placed Successfully!');
    } else {
        setMessage('Please try again after sometime!')
    }
  }, [success]);




  return (
    <Container className="mt-5">
      <h1 className='mb-4'>{message}</h1>
      
    </Container>
  );
};

export default OrderStatus;