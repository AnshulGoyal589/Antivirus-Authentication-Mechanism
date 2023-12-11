const key=document.getElementById("key");
const adminLogin=document.getElementById("login");
const e=document.getElementById("e");

adminLogin.addEventListener("click",()=>{

    fetch('http://localhost:3000/adminLogin', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({key: key.value }) 
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
});
