function Validation(values) {
    let error = {};
  
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email === "") {
      error.email = "Email should not be empty";
    } else if (!emailPattern.test(values.email)) {
      error.email = "Email is not valid";
    } else {
      error.email = "";
    }
  
    // Password validation
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (values.password === "") {
      error.password = "Password should not be empty";
    } else if (!passwordPattern.test(values.password)) {
      error.password =
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    } else {
      error.password = "";
    }
  
    return error;
  }
  
  export default Validation;
  