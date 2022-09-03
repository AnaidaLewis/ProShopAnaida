import { useEffect, useState } from "react"
import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import {Link, LinkContainer } from 'react-router-bootstrap'
import {listOrders} from '../actions/orderActions'


function OrderListScreen() {
    const dispatch = useDispatch()

    const orderList = useSelector( state => state.orderList)
    const {loading, error, orders} = orderList

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    let navigate = useNavigate();

    useEffect(() => {
        if(userInfo && userInfo.isAdmin)
        {
            dispatch(listOrders())
        }else{
            navigate('/login')
        }
    }, [dispatch,userInfo])
  

    return (
    <div>
        <h1>Orders</h1>
        {loading
        ? (<Loader />)
        : error
            ? (<Message variant = 'danger'> {error}</Message>)
            : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>Total</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user && order.user.name}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>${order.totalPrice}</td>
                            <td>{order.isPaid ? (
                                order.paidAt.substring(0, 10)
                            ) : (
                                    <i className="fas fa-times" style = {{color : 'red'}}></i>
                                )}
                            </td>

                            <td>{order.isDelivered ? (
                                    order.deliveredAt.substring(0, 10)
                                ) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order.id}`}>
                                        <Button variant='light' className='btn-sm'>
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td> 
                        </tr>
                        ))}
                    </tbody>

                </Table>
            )
        }
    </div>
  )
}

export default OrderListScreen