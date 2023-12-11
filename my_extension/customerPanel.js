const main=document.getElementById('main');
const logout=document.getElementById('logout');
const user=localStorage.getItem('user');
const time=localStorage.getItem('time');

logout.addEventListener('click',()=>{
    fetch('http://localhost:3000/logout', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username:user })

      }) 
      .then(response => response.json())
      .then(data => { 
        if(data.message==='1'){
            window.location.href='customer.html';
        } 
      })
      .catch(error => {
      });
})


fetch('http://localhost:3000/userDataSpecific', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username:user })
      }) 
      .then(response => response.json())
      .then(data => {
        const ul=document.createElement('ul');
        const li1=document.createElement('li');
        const li2=document.createElement('li');
        const li3=document.createElement('li');
        li1.innerHTML=`License Key: ${data.username}`;
        li2.innerHTML=`Phone Number: ${data.phoneNumber}`;
        let remainingTime=parseFloat(time);
        const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
        const milliseconds = remainingTime % 1000;
        const countdownString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
        li3.innerHTML=`Expiry Time Left: ${countdownString}`;
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        main.appendChild(ul); 
      })
      .catch(error => { 
      });