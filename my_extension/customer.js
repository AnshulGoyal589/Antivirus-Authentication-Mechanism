document.addEventListener('DOMContentLoaded', function() {
    const crudForm = document.getElementById('crudForm');
    const usersList = document.getElementById('usersList');
    const register = document.getElementById('register');
    const login = document.getElementById('login');
  
    
    login.addEventListener('click', function(event) {
  
      const username = document.getElementById('username').value;
      // const password = document.getElementById('password').value;
      const phoneNumber = document.getElementById('phoneNumber').value;
      const e = document.getElementById('e');
  
      
      fetch('http://localhost:3000/create', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username,  phoneNumber })
      }) 
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        if(data.message==='1'){
            e.innerHTML="You are not registered!!";
        }else{
          localStorage.setItem('user',data.username);
          localStorage.setItem('time',data.remainingTime);
          window.location.href='customerPanel.html'
          let remainingTime=parseFloat(data.message);
          const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
          const hours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
          const milliseconds = remainingTime % 1000;
          const countdownString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
          e.innerHTML=`Expiry Time Left: ${countdownString}`;  
        }
      })
      .catch(error => {
      });
    });
  
    // register.addEventListener('click', function() {

    //   const username = document.getElementById('username').value;
    //   const password = document.getElementById('password').value;
    //   const phoneNumber = document.getElementById('phoneNumber').value;
    //   console.log(username , password , phoneNumber);
    //   const e = document.getElementById('e');
  
      
    //   fetch('http://localhost:3000/reg', {
    //     method: 'POST', 
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ username, password, phoneNumber })
    //   }) 
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data.message);
    //     if(data.message==='1'){
    //         e.innerHTML="You have registered successfully!!";
    //     }else{
    //         e.innerHTML="You already have an account!";
    //     }
    //   })
    //   .catch(error => {
    //   });
    // });
  
    // renew.addEventListener('click', function() {

    
  
    //   const username = document.getElementById('username').value;
    //   const password = document.getElementById('password').value;
    //   const phoneNumber = document.getElementById('phoneNumber').value;
    //   console.log(username , password , phoneNumber);
    //   const e = document.getElementById('e');
  
      
    //   fetch('http://localhost:3000/renew', {
    //     method: 'POST', 
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ username, password, phoneNumber })
    //   }) 
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data.message);
    //     if(data.message==='1'){
    //         e.innerHTML="You are not registered!";
    //     }else{
    //         e.innerHTML="Renewed";
    //     }
    //   })
    //   .catch(error => {
    //   });
    // });
  

  });
  