
const submitbtn=document.getElementById('submitbtn')
submitbtn.addEventListener('click',()=>{
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('number').value;
  const password = document.getElementById('password').value;
  axios.post('http://localhost:8000/signup',{
    username,
    email,
    phone,
    password
  }).then(response => 
  alert(`${response.data.message}`)
).catch(error => console.error('There was a problem with the Axios request:', error))
})