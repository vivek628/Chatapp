window.onload = async function() {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/getallgroup', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const groups = res.data.groups;
        const groupListContainer = document.querySelector('.group-list');
        groupListContainer.innerHTML = '';

        groups.forEach(async (group) => {
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';

            const groupDp = document.createElement('div');
            groupDp.className = 'group-dp';
            groupDp.style.backgroundSize = 'cover';
            groupDp.style.backgroundPosition = 'center';

            const groupInfo = document.createElement('div');
            groupInfo.className = 'group-info';

            const groupName = document.createElement('div');
            groupName.className = 'group-name';
            groupName.textContent = group.groupname;

            const groupLastMessage = document.createElement('div');
            groupLastMessage.className = 'group-last-message';
            groupLastMessage.textContent = group.lastMessage || 'No messages yet';

            groupInfo.appendChild(groupName);
            groupInfo.appendChild(groupLastMessage);

            groupItem.appendChild(groupDp);
            groupItem.appendChild(groupInfo);
            groupListContainer.appendChild(groupItem);

            groupItem.addEventListener('click', async () => {
                const groupmembers = await axios.get('http://localhost:8000/members', {
                    params: { groupid: group.id }
                });

                const groupmsgs = await axios.get('http://localhost:8000/getgroupmsg', {
                    params: { groupid: group.id }
                });

                const messagesContainer = document.getElementById('messages');
                messagesContainer.innerHTML = ''; 

                groupmsgs.data.msgs.forEach((msg) => {
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'message'; 
                    const p = document.createElement('p');
                    p.textContent = msg.groupmsg;
                    msgDiv.appendChild(p);
                    messagesContainer.appendChild(msgDiv);
                });

                const memberBox = document.getElementById('chatWith');
                memberBox.innerText = groupmembers.data.groups.join(',');

                document.getElementById('chatBox').classList.remove('hidden');

                document.getElementById('sendMessage').addEventListener('click', async () => {
                    const msg = document.getElementById('messageInput').value;
                    await axios.post('http://localhost:8000/sendgroupmsg', {
                        msg,
                        groupid: group.id
                    }, { headers: { 'Authorization': `Bearer ${token}` } });

                    document.getElementById('messageInput').value = '';
                });

                document.getElementById('closeChat').addEventListener('click', () => {
                    document.getElementById('chatBox').classList.add('hidden');
                });
            });
        });
    } catch (e) {
        console.log(e);
    }
};
