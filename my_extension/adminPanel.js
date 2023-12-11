const list=document.getElementById("list");
const keyGenForm=document.getElementById('keyGenForm');
const keyViaPhone=document.getElementById('keyViaPhone');
const allInfo=document.getElementById('allInfo');

function fetchAllData(){
  fetch('http://localhost:3000/allData', {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json'
            }
          }) 
          .then(response => response.json()) 
          .then(data => {
            allInfo.innerHTML=`Total Users: ${data.totalUsers}
                               Active Sessions: ${data.totalActiveSessions}`
          })
          .catch(error => {
          }); 
}
fetchAllData();

keyGenForm.addEventListener('submit',(event)=>{
      event.preventDefault();
      fetch(`http://localhost:3000/keyGen`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({ phoneNumber:keyViaPhone.value })
      }) 
      .then(response => response.json())
      .then(data => {
        if(data.message==='0'){
            alert('This Phone Number is already Registered!!')
        }else{
        let element=data;
        let li = document.createElement('li');
        let a = document.createElement('select');
        let chat = document.createElement('div');
        let option1 = document.createElement('option');
        let option2 = document.createElement('option');
        let option3 = document.createElement('option');
        let option4 = document.createElement('option');
        let option5 = document.createElement('option');      
        let kill = document.createElement('div');
        kill.innerHTML='Kill';
        const currentTime = new Date();
        element.expireAt = new Date(element.expireAt);
        const remainingTime = element.expireAt - currentTime;
        if(parseFloat(remainingTime)<0){
          fetch('http://localhost:3000/delete', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username:element.username }) 
          }) 
          .then(response => response.json()) 
          .then(data => {
            if(data.message==='1'){
                window.location.href='/userData';
            }
          })
          .catch(error => {
          });
        }
        let remainingTimeFloat = parseFloat(remainingTime);
        const days = Math.floor(remainingTimeFloat / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remainingTimeFloat % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTimeFloat % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTimeFloat % (60 * 1000)) / 1000);
        const milliseconds = remainingTimeFloat % 1000;
        a.addEventListener("dblclick",(event)=>{
          event.preventDefault();
          fetch(`http://localhost:3000/edit`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ id: element._id,val: event.target.value })
          }) 
          .then(response => response.json())
          .then(data => {
            if(data.message==='0'){
              e.innerHTML="Invalid Admin Key!"
          }else{
              window.location.href = "adminPanel.html";
          }
          })
          .catch(error => {
          });
        })
        chat.innerHTML='Chat'
        chat.addEventListener('click',(event)=>{
          fetch('http://localhost:3000/chat', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username:element.username }) 
          }) 
          .then(response => response.json()) 
          .then(data => {
            if(data.message==='1'){
                window.location.href='/chatPanel.html';
            }
          })
          .catch(error => {
          });
        })
        a.innerHTML="Edit";
        kill.addEventListener('click',(event)=>{
          fetch('http://localhost:3000/kill', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username:element.username }) 
          }) 
          .then(response => response.json()) 
          .then(data => {
            if(data.message==='1'){
                window.location.href='/adminPanel.html';
            }
          })
          .catch(error => {
          });
        })
        option1.innerHTML="+1 hour";
        option2.innerHTML="+1 day";
        option3.innerHTML="+1 week"; 
        option4.innerHTML="+1 month"; 
        option5.innerHTML="+1 year"; 
        a.appendChild(option5);
        a.appendChild(option4);
        a.appendChild(option3);
        a.appendChild(option2);
        a.appendChild(option1);
        a.style.cursor='pointer';
        let o1=document.createElement('li');
        let o2=document.createElement('li');
        let o3=document.createElement('li');
        o1.innerHTML=`License Number: ${element.username}`;
        o2.innerHTML=`Phone Number: ${element.phoneNumber}`;
        o3.innerHTML=`Expiry: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
        li.appendChild(o1);
        li.appendChild(o2);
        li.appendChild(o3);
        list.appendChild(li);

        const divv=document.createElement('div');
        divv.style.display='flex';
        divv.style.gap='40px';
        chat.style.textDecoration='none';
        chat.style.color='white';
        chat.style.backgroundColor='green';
        chat.style.padding='10px';
        chat.style.fontSize='20px';
        kill.style.textDecoration='none';
        kill.style.color='white';
        kill.style.backgroundColor='red';
        kill.style.padding='10px';
        kill.style.fontSize='20px';
  
        divv.appendChild(chat);
        divv.appendChild(a);
        divv.appendChild(kill);

        list.appendChild(divv);
        const intervalId = setInterval(() => {
          remainingTimeFloat-=1000;
          if(remainingTimeFloat>0){
              const days = Math.floor(remainingTimeFloat / (24 * 60 * 60 * 1000));
              const hours = Math.floor((remainingTimeFloat % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
              const minutes = Math.floor((remainingTimeFloat % (60 * 60 * 1000)) / (60 * 1000));
              const seconds = Math.floor((remainingTimeFloat % (60 * 1000)) / 1000);
              const milliseconds = remainingTimeFloat % 1000;
            o3.innerHTML=`Expiry: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
          }else{
              o3.innerHTML=`Expiry: EXPIRED`;
          }
        }, 1000);
        setTimeout(function() {
            clearInterval(intervalId); 
            console.log('Interval cleared.');
        },remainingTimeFloat );
      }
        });

      
  
})

fetch('http://localhost:3000/userData')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if(!data){
      allInfo.innerHTML='No Registered Uers Right Now!'
    }else{
      
    data.forEach(element => {
      let li = document.createElement('li');
      let a = document.createElement('select');
      let chat = document.createElement('div');
      let kill = document.createElement('div');
      // let renew = document.createElement('div');
      let option1 = document.createElement('option'); 
      let option2 = document.createElement('option');
      let option3 = document.createElement('option');
      let option4 = document.createElement('option');
      let option5 = document.createElement('option');
      const currentTime = new Date();
      element.expireAt = new Date(element.expireAt);
      const remainingTime = element.expireAt - currentTime;
      if(parseFloat(remainingTime)<0){
        fetch('http://localhost:3000/delete', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username:element.username }) 
        }) 
        .then(response => response.json()) 
        .then(data => {
          if(data.message==='1'){
              window.location.href='/userData';
          }
        })
        .catch(error => {
        });
      }
      let remainingTimeFloat = parseFloat(remainingTime);
  
      const days = Math.floor(remainingTimeFloat / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remainingTimeFloat % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((remainingTimeFloat % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remainingTimeFloat % (60 * 1000)) / 1000);
      const milliseconds = remainingTimeFloat % 1000;
      a.addEventListener("dblclick",(event)=>{
        event.preventDefault();
        fetch(`http://localhost:3000/edit`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ id: element._id,val: event.target.value })
        }) 
        .then(response => response.json())
        .then(data => {
          if(data.message==='0'){  
            e.innerHTML="Invalid Admin Key!"
        }else{
            window.location.href = "adminPanel.html";
        }
        })
        .catch(error => {
        });
      })

      chat.innerHTML='Chat';
      kill.innerHTML='Kill';
      // renew.innerHTML='Renew';
      chat.addEventListener('click',(event)=>{
        fetch('http://localhost:3000/chat', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username:element.username }) 
        }) 
        .then(response => response.json()) 
        .then(data => {
          if(data.message==='1'){
              window.location.href='/chatPanel.html';
          }
        })
        .catch(error => {
        });
      })
      kill.addEventListener('click',(event)=>{
        fetch('http://localhost:3000/kill', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username:element.username }) 
        }) 
        .then(response => response.json()) 
        .then(data => {
          if(data.message==='1'){
              window.location.href='/adminPanel.html';
          }
        })
        .catch(error => {
        });
      })
      // kill.addEventListener('click',(event)=>{
      //   fetch('http://localhost:3000/renewDo', {
      //     method: 'POST', 
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({ username:element.username }) 
      //   }) 
      //   .then(response => response.json()) 
      //   .then(data => {
      //     if(data.message==='1'){
      //         window.location.href='/adminPanel.html';
      //     }
      //   })
      //   .catch(error => {
      //   });
      // })
      a.innerHTML="Edit";
      option1.innerHTML="+1 hour";
      option2.innerHTML="+1 day";
      option3.innerHTML="+1 week"; 
      option4.innerHTML="+1 month"; 
      option5.innerHTML="+1 year"; 
      a.appendChild(option5);
      a.appendChild(option4);
      a.appendChild(option3);
      a.appendChild(option2);
      a.appendChild(option1);
      a.style.cursor='pointer';
      let o1=document.createElement('li');
      let o2=document.createElement('li');
      let o3=document.createElement('li');
      o1.innerHTML=`License Number: ${element.username}`;
      o2.innerHTML=`Phone Number: ${element.phoneNumber}`;
      o3.innerHTML=`Expiry: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
      li.appendChild(o1);
      li.appendChild(o2);
      li.appendChild(o3);
      list.appendChild(li);

      const divv=document.createElement('div');
      divv.style.display='flex';
      divv.style.gap='40px';
      chat.style.textDecoration='none';
      chat.style.color='white';
      chat.style.backgroundColor='green';
      chat.style.padding='10px';
      chat.style.fontSize='20px';
      kill.style.textDecoration='none';
      kill.style.color='white';
      kill.style.backgroundColor='red';
      kill.style.padding='10px';
      kill.style.fontSize='20px';
      // renew.style.textDecoration='none';
      // renew.style.color='white';
      // renew.style.backgroundColor='blue';
      // renew.style.padding='10px';
      // renew.style.fontSize='20px';

      divv.appendChild(chat);
      divv.appendChild(a);
      divv.appendChild(kill);
      // divv.appendChild(renew);


      list.appendChild(divv);
      // list.appendChild(chat);
      const intervalId = setInterval(() => {
         remainingTimeFloat-=1000;
         if(remainingTimeFloat>0){
            const days = Math.floor(remainingTimeFloat / (24 * 60 * 60 * 1000));
            const hours = Math.floor((remainingTimeFloat % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const minutes = Math.floor((remainingTimeFloat % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((remainingTimeFloat % (60 * 1000)) / 1000);
            const milliseconds = remainingTimeFloat % 1000;
           o3.innerHTML=`Expiry: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
         }else{
            o3.innerHTML=`Expiry: EXPIRED`;
         }
      }, 1000);
      setTimeout(function() {
          clearInterval(intervalId); 
          console.log('Interval cleared.');
      },remainingTimeFloat );
      });
    }
  
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });