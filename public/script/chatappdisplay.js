window.addEventListener('load', async function() {
    try {
        const token= this.localStorage.getItem('token')
      
        const res = await axios.get('http://localhost:8000/users',{

            headers:{

                'Authorization': `Bearer ${token}`
            }
        });
       const users = res.data.users;
      

        const profiles = document.getElementById('profiles');
        const chatBox = document.getElementById('chatBox');
        const chatWith = document.getElementById('chatWith');
        const closeChat = document.getElementById('closeChat');
        const messageInput = document.getElementById('messageInput');
        const sendMessage = document.getElementById('sendMessage');
        const messages = document.getElementById('messages');

        users.forEach((user) => {
            const profile = document.createElement('div');
            profile.setAttribute('class', 'profile');
            profile.dataset.username = user.username; 
            profiles.appendChild(profile);

            const dp = document.createElement('div');
            dp.setAttribute('class', 'dp');
            profile.appendChild(dp);

            const name = document.createElement('div');
            name.setAttribute('class', 'name');
            name.textContent = user.username;
            profile.appendChild(name);

            profile.addEventListener('click', async() => {

                chatBox.classList.remove('hidden');
                chatWith.textContent = `Chat with ${user.username}`;
               
                if(localStorage.getItem('allmsg')=='')
                {
                    
                    localStorage.setItem('allmsg',JSON.stringify([]))
                    var lastid= 0
                }
                

                setInterval(async()=>{
                    
                    messages.innerHTML=''
                    const resposne = await axios.get('http://localhost:8000/msg', {
                        params: {
                          to: user.username ,
                          lastid:lastid
                        },
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                      })
                      console.log(resposne.data.all_msgs)

                      console.log(resposne.data.all_msgs.length,"this is len")
                      const newmsg=resposne.data.all_msgs
                      
                      const oldmsg=JSON.parse(localStorage.getItem('allmsg'))
                      
                      localStorage.setItem('allmsg',JSON.stringify(oldmsg.concat(newmsg)))
                      
                      lastid=JSON.parse(localStorage.getItem('allmsg')).length
                     
                    
                      JSON.parse(localStorage.getItem('allmsg')).forEach(msg=>{
                       
                       
                        const messageElement = document.createElement('div');
                        const messageString = JSON.stringify(msg);
                     messageElement.textContent = messageString ;
                     messages.appendChild(messageElement);
                   
                      })
                },1000)
             

                
            });
        });

       
        sendMessage.addEventListener('click', async () => {
            const message = messageInput.value;
            if (message.trim() === '') return;

            try {
               
                await axios.post('http://localhost:8000/sendMessage', {
                    to: chatWith.textContent.replace('Chat with ', ''),
                    message: message
                },{
                    headers:{

                        'Authorization': `Bearer ${token}`
                    }
                });
            
               
                
                const messageElement = document.createElement('div');
               // messageElement.textContent = message;
                //messages.appendChild(messageElement);

                
                messageInput.value = '';
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        
        closeChat.addEventListener('click', () => {
            chatBox.classList.add('hidden');
        });

    } catch (error) {
        console.error('Error fetching users:', error);
    }
});
