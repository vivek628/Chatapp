const axios= require('axios')
const submitbtn=document.getElementById('submitbtn')
submitbtn.addEventListener('click',()=>{
  axios.post('http://localhost:8000/signup')
}).then(response => console.log(response.data))
.catch(error => console.error('There was a problem with the Axios request:', error));