import { useEffect, useState } from "react"
import React from 'react'
import {Link,useLocation, useNavigate} from 'react-router-dom'
import {Form, Button, Row, Col, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import {getUserDetails, updateUserProfile} from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants"
import {listMyOrders} from '../actions/orderActions'
import { LinkContainer } from "react-router-bootstrap"



function ProfileScreen() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    
    const userDetails = useSelector(state => state.userDetails)
    const {loading, user, error} = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin


    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile


    const orderListMy = useSelector(state => state.orderListMy)
    const { loading : loadingOrders, error: errorOrders, orders } = orderListMy

  let navigate = useNavigate();

    useEffect(() => {
        if(!userInfo){
            
            let pathname = '/login'
            navigate(pathname)
        }
        else{
            if(!user || !user.name || success || userInfo.id !== user.id){
                dispatch({type : USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            }else{
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, user, userInfo, success])


    const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmPassword){
            setMessage('Passwords do not match')
        }
        else{
            dispatch(updateUserProfile({
                'id': user.id,
                'name':name,
                'email' : email,
                'password' : password
            }))
            setMessage('')
        }
    }



  return (
    <div>
        <Row>
            <Col md = {3}>
                <h2>User Profile</h2>

                {message && <Message variant = 'danger'>{message}</Message>}
                {error && <Message variant = 'danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit = {submitHandler}>

                <Form.Group controlId = 'name' className = 'py-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        required
                        type = 'name'
                        placeholder = 'Enter Name'
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId = 'email' className = 'py-3'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                        required
                        type = 'email'
                        placeholder = 'Enter Email'
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                </Form.Group>
                

                <Form.Group controlId = 'password' className = 'py-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                        type = 'password'
                        placeholder = 'Enter Password'
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        >

                        </Form.Control>
                </Form.Group>


                <Form.Group controlId = 'passwordConfirm' className = 'py-3'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                        type = 'password'
                        placeholder = 'Confirm Password'
                        value = {confirmPassword}
                        onChange = {(e) => setConfirmPassword(e.target.value)}
                        >

                        </Form.Control>
                </Form.Group>

                <Button
                        type = 'submit'
                        variant = 'primary'
                        className = 'py-3'
                    >
                        Update
                </Button>
                </Form>

            </Col>

            <Col md = {9}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ?(
                    <Message variant = 'danger'>{errorOrders}</Message>
                ) : (
                    <Table striped responsive className = 'table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => (
                                <tr key = {order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0,10) : (
                                        <i className="fas fa-times" style = {{color : 'red'}}></i>
                                    )}</td>
                                    <td>
                                        <LinkContainer to = {`/order/${order.id}`}>
                                            <Button className = 'btn-sm'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    </div>
  )
}

export default ProfileScreen