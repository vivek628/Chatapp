window.addEventListener('load', async function() {
    const socket = io();
    let setIntervalid;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage.');
            return;
        }

        const res = await axios.get('http://localhost:8000/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const users = res.data.users;
        const profiles = document.getElementById('profiles');
        const chatBox = document.getElementById('chatBox');
        const chatWith = document.getElementById('chatWith');
        const closeChat = document.getElementById('closeChat');
        const messageInput = document.getElementById('messageInput');
        const sendMessage = document.getElementById('sendMessage');
        const messages = document.getElementById('messages');

        if (!profiles || !chatBox || !chatWith || !closeChat || !messageInput || !sendMessage || !messages) {
            console.error('One or more required elements not found.');
            return;
        }

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

            profile.addEventListener('click', async () => {
                if (setIntervalid !== undefined) {
                    clearInterval(setIntervalid);
                }

                chatBox.classList.remove('hidden');
                chatWith.textContent = `Chat with ${user.username}`;

                if (!localStorage.getItem('allmsg')) {
                    localStorage.setItem('allmsg', JSON.stringify([]));
                }
                let lastid = JSON.parse(localStorage.getItem('allmsg')).length;

                // Handle incoming messages for the selected user
                socket.off('message');
                socket.on('message', async (message) => {
                    messages.innerHTML = '';
                    try {
                        const response = await axios.get('http://localhost:8000/msg', {
                            params: { to: user.id, lastid: lastid },
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        const newmsg = response.data.all_msgs;
                        let oldmsg = JSON.parse(localStorage.getItem('allmsg') || '[]');
                        localStorage.setItem('allmsg', JSON.stringify(oldmsg.concat(newmsg)));

                        lastid = JSON.parse(localStorage.getItem('allmsg')).length;

                        JSON.parse(localStorage.getItem('allmsg')).forEach(msg => {
                            if (msg.receiverId == user.id) {
                                const messageElement = document.createElement('div');
                                messageElement.style.color = 'red';
                                messageElement.textContent = msg.message;
                                messages.appendChild(messageElement);
                            }
                        });
                    } catch (error) {
                        console.error('Error fetching messages:', error);
                    }
                });
            });
        });

        sendMessage.addEventListener('click', async () => {
            const message = messageInput.value.trim();
            if (message === '') return;

            try {
                const recipient = chatWith.textContent.replace('Chat with ', '');
                socket.emit('user-message', { recipient, message });

                await axios.post('http://localhost:8000/sendMessage', {
                    to: recipient,
                    message: message
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

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
