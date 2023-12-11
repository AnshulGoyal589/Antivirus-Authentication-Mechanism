const chatList=document.getElementById('chatList');
const sendMessage=document.getElementById('sendMessage');
const send=document.getElementById('send');
function makeReq(){

    fetch('http://localhost:3000/chatFetch', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json'
          }
        }) 
        .then(response => response.json()) 
        .then(data => {
          data.chats.forEach(element => {
            const li1=document.createElement('li');
            const li2=document.createElement('li');
            li1.innerHTML=("Customer: "+element.customer);
            
            li2.innerHTML=("Admin: "+element.admin);
            li2.style.backgroundColor='lightgray';
            li1.style.backgroundColor='#edede9';
            li2.style.marginLeft='-40px';
            li2.style.fontSize='20px';
            li2.style.paddingTop='10px';
            li2.style.paddingBottom='10px';
            li2.style.paddingLeft='5px';
            li1.style.marginLeft='-40px';
            li1.style.fontSize='20px';
            li1.style.paddingTop='10px';
            li1.style.paddingBottom='10px';
            li1.style.paddingRight='5px';
            li1.style.textAlign='right';
            if(element.customer.length!==0){chatList.appendChild(li1);}
            if(element.admin.length!==0){chatList.appendChild(li2);}
            
          });
        }) 
        .catch(error => {
        });

}

makeReq();
send.addEventListener('click',(event)=>{
  
  fetch('http://localhost:3000/chatSend', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify({ message:sendMessage.value }) 
  }) 
  .then(response => response.json()) 
  .then(data => {
    data.chats.forEach(element => {
          const li1=document.createElement('li');
          const li2=document.createElement('li');
          li1.innerHTML=element.customer;
          li2.innerHTML=element.admin;
          chatList.appendChild(li1);
          chatList.appendChild(li2);
    });
  })
  .catch(error => {
  });
})

