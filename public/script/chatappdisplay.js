window.addEventListener('load', async function() {
    try {
        const res = await axios.get('http://localhost:8000/users');
        const users = res.data.users;
        
        const profiles = document.getElementById('profiles');
        
        users.forEach((user) => {
            const profile = document.createElement('div');
            profile.setAttribute('class', 'profile');
            profiles.appendChild(profile);
            
            const dp = document.createElement('div');
            dp.setAttribute('class', 'dp');
            profile.appendChild(dp);
            
            const name = document.createElement('div');
            name.setAttribute('class', 'name');
            name.textContent = user.username;
            profile.appendChild(name);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});
