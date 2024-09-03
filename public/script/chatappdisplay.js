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
                
                const msg = await axios.get('http://localhost:8000/msg', {
                    params: {
                      to: user.id // This sends 'to' as a query parameter
                    },
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  })
                
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
                messageElement.textContent = message;
                messages.appendChild(messageElement);

                
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
