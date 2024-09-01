const submitbtn= document.getElementById('submitbtn')
submitbtn.addEventListener('click',()=>{
    const password=document.getElementById('password').value
    const email=document.getElementById('email').value
    axios.post('http://localhost:8000/postlogin',{
        password,
        email
    })
    
})