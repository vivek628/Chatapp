const submitbtn= document.getElementById('loginForm')

submitbtn.addEventListener('submit',(e)=>{
    e.preventDefault()
    const password=document.getElementById('password').value
    const email=document.getElementById('email').value
    console.log(password,email)
    axios.post('http://localhost:8000/postlogin',{
        password,
        email
    })  .then(response => {
        
       alert('Login successful!');
       const token=response.data.token
       localStorage.setItem('token',token)
       window.location.href = 'http://localhost:8000/display';
    })
    .catch(error => {
        console.error('There was a problem with the Axios request:', error);
        alert('Login failed. Please try again.');
    });
})
    
