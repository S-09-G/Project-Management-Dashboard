import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        // Clearing errors when user starts typing
        setErrors(prev => ({ ...prev, [event.target.name]: '' }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        // If there are no validation errors, proceed with form submission
        if (Object.keys(validationErrors).length === 0) {
            // Your form submission logic here
        }
        if(errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/login', values)
            .then(res =>{
                if(res.data === "success"){
                    navigate('/home');
                } else{
                    alert("No Record Exists");
                }
              
            })
            .catch(err => console.log(err));
          }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
            <div className='bg-white p-3 rounded w-25'>
            <img src={require('./images/iDEX-Final-Logo-03 (1).jpg')} alt="Logo" style={{ width: 'auto', height: '70px' }} />
                <h2 className='text-center'>LOG-IN</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            name='email'
                            onChange={handleInput}
                            value={values.email}
                            className='form-control rounded 0'
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='Password'><strong>Password</strong></label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            name='password'
                            onChange={handleInput}
                            value={values.password}
                            className='form-control rounded 0'
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100'>Log in</button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
