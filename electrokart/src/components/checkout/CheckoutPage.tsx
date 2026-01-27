import React, { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { addToCart, clearCart, removeFromCart } from '../store/cartSlice';

interface Products {
    id: number;
    product_name: string;
    product_category: string;
    image_url: string;
    product_description: string;
    price: number,
    product_quantity: string
}

interface Data {
    success: boolean;
    message: string;
    data: Data[]
}

interface CartItem extends Products {
    count: number
}



const Checkout: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalItems = cartItems.reduce((sum, item) => sum + item.count, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item?.count * item?.price, 0);

    const userInfo = useSelector((state: RootState) => state.userInfo.user_id);
    const user_id = userInfo === 0 ? sessionStorage.getItem('user_id') : userInfo

    console.log('userInfo', userInfo)
    const generateCartId = () => {
        return 'cart_id-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };
    const cartId = generateCartId()

    const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/updateCart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
                body: JSON.stringify({ cart_id: cartId, user_id: user_id, products: cartItems, total_cost: totalPrice })
            });

            const data = await response.json();
            if (data) {
                console.log('data', data)
                // sessionStorage.setItem('token', data.token)
                dispatch(clearCart());
                navigate('/orderStatus', { state: { data: data, orderId: cartId }, replace: true })
            } else {
                alert("Checkout Failed: " + data.message);
            }
        } catch (err) {
            console.error("Connection error", err);
        }
    };

    return (
        <div className='d-flex flex-column min-vh-100'>

            <Container className="mt-5">
                {
                    <>
                        {cartItems?.length <= 0
                            ?
                            <h1>No items in your cart. Add some!</h1>
                            :
                            <>
                                <div className="container text-center border rounded-top bg-success border-success my-2">
                                    <div className="row align-items-center">
                                        <div className="col py-2">
                                            <h5>Product</h5>

                                        </div>
                                        <div className="col">
                                            <h5> Product Info</h5>

                                        </div>
                                        <div className="col">
                                            <h5> Price</h5>
                                        </div>
                                    </div>
                                </div>
                                {
                                    cartItems?.map((item, index) => {
                                        return (
                                            <div key={item.id} className="container text-center border rounded border-success my-2">
                                                <div className="row align-items-center">
                                                    <div className="col">
                                                        <div className='mt-2 d-flex' style={{ justifyContent: 'space-around' }}>
                                                            <h1 className='badge bg-secondary' style={{ alignContent: 'center' }}>{index + 1}</h1>
                                                            <img src={item?.image_url} className="" style={{ width: "50%", height: '80%' }} alt="Image" />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <h5 className="card-title text-primary">{item?.product_name}</h5>
                                                        <p className="card-text mt-2">{`Units: ${item?.count}`}</p>
                                                    </div>
                                                    <div className="col">
                                                        <h5 className="card-title text-primary">{`${item?.count} x ${item?.price}`} </h5>
                                                        <p className="card-text mt-2">Amount: ${item?.count * item?.price}</p>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => dispatch(removeFromCart(item?.id))}
                                                        >Remove item from cart</button>


                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className="container text-center border rounded-bottom border-success my-2">
                                    <div className="row align-items-center">
                                        <div className="col py-2">

                                        </div>
                                        <div className="col py-2">
                                            <h5>Total Units: {totalItems}</h5>

                                        </div>
                                        <div className="col py-2">
                                            <h5>Total Price: ${totalPrice}</h5>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </>

                }

            </Container >
            <div className="mt-auto sticky-bottom" style={{ maxWidth: "100%", backgroundColor: "dodgerblue" }}>
                <button className="btn my-2 btn-light" type="submit" style={{ border: '2px solid white' }} disabled={cartItems?.length <= 0} onClick={handlePlaceOrder} >Place Order</button>
            </div>
        </div>

    );
};

export default Checkout;