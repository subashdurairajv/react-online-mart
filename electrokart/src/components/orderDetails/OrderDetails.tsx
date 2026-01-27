import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addToCart, removeFromCart } from '../store/cartSlice';


export interface OrderDetail {
    id: number;
    product_name: string;
    product_category: string;
    image_url: string;
    product_description: string;
    price: number,
    product_quantity: string,
    count: number
}

type Order = {
    cart_id: string,
    created_at: string,
    products: OrderDetail[],
    total_cost: string,
    user_id: number
}

type Message = {
    message: string
}

const OrderDetails: React.FC = () => {
    const [orderDetail, setOrderDetail] = useState<Order[] | null>(null);
    const user_id = sessionStorage.getItem('user_id')


    const fetchOrderDetail = async () => {

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
            });
            return response.json()
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchOrderDetail();
            console.log('data')
            if (data?.success === true) {
                setOrderDetail(data?.data)
            }

        };

        loadData();
    }, [])


    console.log('testorder', orderDetail)

    return (
        <div className='d-flex flex-column min-vh-100'>

            <Container className="mt-5">
                {
                    orderDetail && orderDetail.length > 0 && orderDetail.map((item, index) => {
                        const totalItems = item?.products?.reduce((sum, product) => sum + product.count, 0);
                        const totalPrice = item?.products?.reduce((sum, product) => sum + product?.count * product?.price, 0);
                        const dateObj = new Date(item?.created_at);

                        // Extract Date
                        const date = dateObj.toLocaleDateString(); // e.g., "1/26/2026"
                        // Extract Time
                        const time = dateObj.toLocaleTimeString();
                        return (
                            <>
                                <div className="container text-center border rounded-top bg-success border-success my-2">
                                    <div className="row align-items-center">
                                        <div className="col py-2">
                                            <p ><span style={{color: 'white'}} >{index + 1}.</span> OrderId: <span style={{color: 'white'}} >{item?.cart_id}</span></p>

                                        </div>
                                        <div className="col py-2">
                                            <p>Date & Time: <span style={{color: 'white'}} >{`${date} & ${time}`}</span></p>

                                        </div>
                                    </div>
                                </div>
                                {item.products?.length <= 0
                                    ?
                                    <h1>No items in your cart. Add some!</h1>
                                    :
                                    <>

                                        {
                                            item.products?.map((item, index) => {
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
                        )
                    })


                }

            </Container >

        </div>

    );
};

export default OrderDetails;