import { useEffect, useState } from "react"
import React from 'react'
import {Link,useLocation, useNavigate, useParams} from 'react-router-dom'
import {Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import {getUserDetails, updateUser} from '../actions/userActions'
import {USER_UPDATE_RESET} from '../constants/userConstants'

function UserEditScreen() {


    const {id} = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    
    const dispatch = useDispatch()
    
    const userDetails = useSelector(state => state.userDetails)
    const {error, user, loading} = userDetails


    const userUpdate = useSelector(state => state.userUpdate)
    const {error : errorUpdate, loading : loadingUpdate, success : successUpdate} = userUpdate

    let navigate = useNavigate();

    useEffect(() => {
        if(successUpdate){
            dispatch({type : USER_UPDATE_RESET})
            navigate('/admin/userlist')
        }
        else{
            if(!user.name || user.id !== Number(id)){
                dispatch(getUserDetails(id))
            }
            else{
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }
    
    }, [id, user, successUpdate])


    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({id : user.id, name, email, isAdmin}))

    }



  return (
    <div>
        <Link to = '/admin/userlist'>
            Go Back
        </Link>
        
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader/>}
            {errorUpdate && <Message variant = 'danger'>{errorUpdate}</Message>}
            
            {loading ? (<Loader />) 
                    : error ? (<Message variant = 'danger'>{error}</Message>)
                            : (
                                <Form onSubmit = {submitHandler}>

                                <Form.Group controlId = 'name' className = 'py-3'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
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
                                        type = 'email'
                                        placeholder = 'Enter Email'
                                        value = {email}
                                        onChange = {(e) => setEmail(e.target.value)}
                                        >
                                        </Form.Control>
                                </Form.Group>
                                
                    
                                <Form.Group controlId = 'isadmin' 
                                className = 'py-3'
                                >
                                    <Form.Check
                                    
                                    type = 'checkbox'
                                    label = 'Is Admin'
                                    checked = {isAdmin}
                                    onChange = {(e) => setIsAdmin(e.target.checked)}
                                    >
                    
                                    </Form.Check>
                                </Form.Group>
                    
                    
                                <Button
                                        type = 'submit'
                                        variant = 'primary'
                                        className = 'py-3'
                                    >
                                        Update
                                </Button>
                                </Form>
            )}
            
        </FormContainer>
    </div>
  )
}

export default UserEditScreen