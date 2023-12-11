const keyGenForm=document.getElementById('keyGenForm');
const keyViaPhone=document.getElementById('keyViaPhone');
const e=document.getElementById('e');

keyGenForm.addEventListener('submit',(event)=>{
      event.preventDefault();
      function isValidTelephoneNumber(number) {
        // Define a regular expression for the expected telephone number format
        const phoneNumberRegex = /^\d{10}$/;
    
        // Check if the provided number matches the pattern
        return phoneNumberRegex.test(number);
    }

    if(isValidTelephoneNumber(keyViaPhone.value)){

   
    
      fetch(`http://localhost:3000/keyGen`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({ phoneNumber:keyViaPhone.value })
      }) 
      .then(response => response.json())
      .then(data => {
        let element=data;
        const currentTime = new Date();
        element.expireAt = new Date(element.expireAt); 
        const remainingTime = element.expireAt - currentTime;
        let remainingTimeFloat = parseFloat(remainingTime);
        const days = Math.floor(remainingTimeFloat / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remainingTimeFloat % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTimeFloat % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTimeFloat % (60 * 1000)) / 1000);
        const milliseconds = remainingTimeFloat % 1000;
        e.innerHTML=`license key: ${element.username} 
        Expiry: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;

      })
      .catch(error => {
      });
    }else{
      e.innerHTML="Invalid Phone Number Format";
    }
})