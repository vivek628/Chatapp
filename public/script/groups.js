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
                    params: { groupid: group.id },headers:{
                     'Authorization': `Bearer ${token}`
                    }
                });
                const isAdmin=groupmembers.data.isAdmin
               

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
                
                if(isAdmin)

                {   
                    const notdmin=await axios('http://localhost:8000/notadmin',{
                        params:{groupid:group.id}
                    })
                    const username=notdmin.data.usernames
                    const action=document.getElementById('adminaction')
                    action.innerHTML=''
                   const btn=document.createElement('button')
                   btn.innerText='Remove User'
                  
                   action.appendChild(btn)
                   action.addEventListener('click',async()=>{
                   
                    const chatBox=document.getElementById('box')
                    chatBox.style.display='block'
                    const ul = document.getElementById('userlist');
                    
                    username.forEach(u => {
                      
                        const li = document.createElement('li');
            
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = u;
                        checkbox.className = 'user-checkbox';
            
                        const label = document.createElement('label');
                        label.textContent =u ;
                        label.className = 'user';
            
                        li.appendChild(checkbox);
                        li.appendChild(label);
                        ul.appendChild(li);
                    });
                   })
                   document.getElementById('createGroup').addEventListener('click', async () => {
                    const selectedUsers = Array.from(document.querySelectorAll('.user-checkbox:checked')).map(cb => cb.value);
                    const groupOutput = document.getElementById('groupOutput');
                 
                  
                    
        
                    if (selectedUsers.length > 0) {
                       
                       
                        await axios.get('http://localhost:8000/creatadmin', {
                            params: {members: selectedUsers }
                           
                        });
                        
        
                        alert(`${selectedUsers.join(',')} Remove From Group`);
                        window.location.reload();
                    } else {
                        groupOutput.textContent = 'No users selected.'
                        alert("No user selected");
                    }
                });
        
                }
                

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
