import { useEffect, useState } from "react"
import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {savePaymentMethod} from '../actions/cartActions'

function PaymentScreen() {

  const cart = useSelector(state => state.cart)
  const {shippingAddress} = cart

  const dispatch = useDispatch()

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  let navigate = useNavigate();

    if(!shippingAddress.address){
        let pathname = '/shipping'
        navigate(pathname)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(paymentMethod)
        dispatch(savePaymentMethod(paymentMethod))
        let pathname = '/placeorder'
        navigate(pathname)
    } 

    const onPaymentMethodChange = ({ target: { value } }) => {
        setPaymentMethod(value);
      };
    

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />

        <Form onSubmit = {submitHandler}>
            <Form.Group>
                <Form.Label as = 'legend'>Select Method</Form.Label>
                <Col>
                    <Form.Check
                        type = 'radio'
                        label = 'PayPal or Credit Card'
                        id = 'PayPal'
                        name = 'paymentMethod'
                        value = 'PayPal'
                        checked = {paymentMethod === 'PayPal'}
                        onChange = {onPaymentMethodChange}
                        >
                            
                    </Form.Check>

                    <Form.Check
                        type = 'radio'
                        label = 'Google Pay'
                        id = 'GooglePay'
                        name = 'paymentMethod'
                        value = 'GooglePay'
                        checked = {paymentMethod === 'GooglePay'}
                        onChange = {onPaymentMethodChange}
                        >
                            
                    </Form.Check>

                </Col>
            </Form.Group>
            <Button type = 'submit' variant = 'primary'>
                Contiue
            </Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen