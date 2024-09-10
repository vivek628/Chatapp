window.addEventListener('load', async function() {
    let setintervalid;

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
                if (setintervalid !== undefined) {
                    clearInterval(setintervalid);
                }

                chatBox.classList.remove('hidden');
                chatWith.textContent = `Chat with ${user.username}`;

                if (localStorage.getItem('allmsg') === null) {
                    localStorage.setItem('allmsg', JSON.stringify([]));
                }
                let lastid = JSON.parse(localStorage.getItem('allmsg')).length;

                setintervalid = setInterval(async () => {
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
                }, 1000);
            });
        });

        sendMessage.addEventListener('click', async () => {
            const message = messageInput.value.trim();
            if (message === '') return;

            try {
                await axios.post('http://localhost:8000/sendMessage', {
                    to: chatWith.textContent.replace('Chat with ', ''),
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

// Group creation logic
document.getElementById('groupbtn').addEventListener('click', async () => {
    const token= localStorage.getItem('token')
    try {
        const userslist = await axios.get('http://localhost:8000/users',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
      
        const current_user=userslist.data.current_user_name
        const users = userslist.data.users;

        document.getElementById('groupbtn').style.display = 'none';
        document.getElementsByClassName('main')[0].style.width = '50%';
        document.getElementById('box').style.display = 'block';

        const ul = document.getElementById('userlist');
        users.forEach(user => {
            const li = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = user.username;
            checkbox.className = 'user-checkbox';

            const label = document.createElement('label');
            label.textContent = user.username;
            label.className = 'user';

            li.appendChild(checkbox);
            li.appendChild(label);
            ul.appendChild(li);
        });

        document.getElementById('createGroup').addEventListener('click', async () => {
            const selectedUsers = Array.from(document.querySelectorAll('.user-checkbox:checked')).map(cb => cb.value);
            const groupOutput = document.getElementById('groupOutput');
            selectedUsers.push(current_user)
            console.log(selectedUsers)
            const token=localStorage.getItem('token')

            if (selectedUsers.length > 0) {
                groupOutput.textContent = `Group Created with users: ${selectedUsers.join(', ')}`;
                const groupname = document.getElementById('groupname').value;

                await axios.get('http://localhost:8000/creategroup', {
                    params: { groupname: groupname, members: selectedUsers },
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                

                alert("Group created");
                window.location.reload();
            } else {
                groupOutput.textContent = 'No users selected. Please select users to create a group.';
                alert("No user selected");
            }
        });

    } catch (error) {
        console.error('Error fetching all users:', error);
    }
});

document.getElementById('test').addEventListener('click', async () => {
    try {
        await axios.get('http://localhost:8000/test');
    } catch (error) {
        console.error('Error fetching test endpoint:', error);
    }
});
