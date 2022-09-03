import { useEffect, useState } from "react"
import React from 'react'
import {useLocation, Link, useNavigate, useParams} from 'react-router-dom'
import {Button, Row,Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import {PayPalButton} from "react-paypal-button-v2"
import Message from "../components/Message";
import Loader from "../components/Loader";
import {getOrderDetails, payOrder, deliverOrder} from '../actions/orderActions'
import {ORDER_PAY_RESET, ORDER_DELIVER_RESET} from '../constants/orderConstants'

function OrderScreen() {

    const {id} = useParams()
    const dispatch = useDispatch()


    // const[sdkReady, setSdkReady] = useState(false)


    const orderDetails = useSelector(state => state.orderDetails)
  const {order, error, loading } = orderDetails

  const orderPay = useSelector(state => state.orderPay)
  const { loading: loadingPay, success: successPay, error : errorPay } = orderPay

  const orderDeliver = useSelector(state => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  
    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }


    // AU7WHbQgidy2sONAruiWMG3tBnFNGXKTYJG7fL9LrVSwgIQLLmNitJA4Xeqc6q79Gxs6LRR38nk9eC7d
  

    // const addPayPalScript = () => {
    //     const script = document.createElement('script')
    //     script.type = 'text/javascript'
    //     script.src = 'https://www.paypal.com/sdk/js?client-id=AU7WHbQgidy2sONAruiWMG3tBnFNGXKTYJG7fL9LrVSwgIQLLmNitJA4Xeqc6q79Gxs6LRR38nk9eC7d'
    //     script.async = true
    //     script.onload = () => {
    //         setSdkReady(true)
    //     }
    //     document.body.appendChild(script)
    // }



  let navigate = useNavigate();



  useEffect(() => {

    if (!userInfo) {
        navigate('/login')
    }

    if(!order || successPay || order.id !== Number(id) || successDeliver){
        dispatch({ type: ORDER_PAY_RESET })
        dispatch({ type: ORDER_DELIVER_RESET })
        dispatch(getOrderDetails(id))
    }
    
    
    // else if(!order.isPaid)
    // {
    //     if(!window.paypal){
    //         addPayPalScript()
    //     }
        
    //     else{
    //         setSdkReady(true)
    //     }
    // }

}, [dispatch, order, id, successPay, successDeliver])



const successPaymentHandler = () => {

    if (window.confirm(`Make payment of ${order.totalPrice} with ${order.paymentMethod}?`)) {
      dispatch(payOrder(id))
  }

}

const deliverHandler = () => {
  dispatch(deliverOrder(order))
}


  return loading ? (
    <Loader />
) : error ? (
    <Message variant='danger'>{error}</Message>
) : (
    <div>
        <h1>Order: {order.id}</h1>
      <Row>
        <Col md = {8}>
           <ListGroup variant = 'flush'>
           <ListGroup.Item>
              <h2>Shipping</h2>
                <p><strong>Name: </strong> {order.user.name}</p>
                <p><strong>Email: </strong> <a href = {`mailto:${order.user.email}`}> {order.user.email}</a></p>

              <p>

                  <strong>Shipping: </strong>
                  {order.shippingAddress.address},  {order.shippingAddress.city}
                  {'  '}
                  {order.shippingAddress.postalCode},
                  {'  '}
                  {order.shippingAddress.country}
              </p>


              {order.isDelivered ? (
                    <Message variant='success'>Delivered on {order.deliveredAt.substring(0,10)}</Message>
                ) : (
                        <Message variant='warning'>Not Delivered</Message>
                    )}
          </ListGroup.Item>


          <ListGroup.Item>
              <h2>Payment Method</h2>

              <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant = 'success'>Paid on {order.paidAt.substring(0,10)}</Message>
              ): (
                <Message variant = 'warning'>Not Paid</Message>
              )}
          </ListGroup.Item>

          <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? <Message variant = 'info'>
                Order is empty
              </Message> : (
                <ListGroup variant = 'flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key = {index}>
                      <Row>
                        <Col md = {1}>
                          <Image src = {item.image} alt = {item.name} fluid rounded />
                        </Col>

                        <Col>
                          <Link to = {`/product/${item.product}`}>{item.name}</Link>
                        </Col>

                        <Col md = {4}>
                          {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )
              
            }
          </ListGroup.Item>

           </ListGroup>
        </Col>

        <Col md = {4}>
            <Card>
              <ListGroup variant = 'flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Item:</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total:</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>


                {!order.isPaid &&  (
                    <ListGroup.Item>
                        {loadingPay && <Loader />}
                        {errorPay && <Message variant='red'>{errorPay}</Message>}
                        {/* {!sdkReady ? (
                            <Loader />
                        ) : ( 
                            <PayPalButton
                                amount={order.totalPrice}
                                onSuccess={successPaymentHandler}
                            />
                        )} */}
                        <Button
                            disabled={order.isPaid}
                            type='submit'
                            variant='primary'
                            onClick={successPaymentHandler}
                        >
                          Pay with {order.paymentMethod}
                        </Button>
                    </ListGroup.Item>
                )}
                
                {loadingDeliver && <Loader />}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                        <Button
                            type='button'
                            className='btn btn-block'
                            onClick={deliverHandler}
                        >
                            Mark As Delivered
                        </Button>
                    </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderScreen