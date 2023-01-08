// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, browserSessionPersistence, setPersistence} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref as ref_database, set, onValue, get, child, push, update} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { getStorage, ref as ref_storage, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy8mK2iT0vI5Iqz-KOZhJ9zU3bge2Pvq8",
  authDomain: "pfd-assignment1.firebaseapp.com",
  databaseURL: "https://pfd-assignment1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pfd-assignment1",
  storageBucket: "pfd-assignment1.appspot.com",
  messagingSenderId: "133665479442",
  appId: "1:133665479442:web:babfd33667f90e95c4b1cb",
  measurementId: "G-36TTBLFNYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
const storage = getStorage();

let PATHNAME = "";
let FIRSTPATHNAME = "";
let x = window.location.pathname.split("/").pop();
PATHNAME = x
FIRSTPATHNAME = window.location.pathname.split("/");


console.log(PATHNAME);
console.log(FIRSTPATHNAME);


const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  var notLoggedIn = document.getElementById("notLoggedIn");
  var loggedIn = document.getElementById("Nameholder");
  var btn = document.getElementById("btn");
  var donate = document.getElementById("dtn");
  var home = document.getElementById("hme");
  var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    localStorage.setItem("uid",uid);
    loggedIn.style.display = "block"
    btn.innerText = "Log out"
    btn.addEventListener("click", () => {
      signOut(auth).then(() => {
        //localStorage.clear();
        myModal.hide();
      }).catch((error) => {
        // An error happened.
      });
    })
    /*if(PATHNAME == "index.html"){
      location.href = "userIndex.html";
    }*/
    home.href = "userIndex.html"
    donate.href = "donation.html"
    returnName();
  } else {
    home.href = "index.html"
    loggedIn.style.display = "none"
    btn.innerText = "Login"
    btn.addEventListener("click", () => {
      myModal.show();
    });
    donate.addEventListener("click", () => {
      myModal.show();
    });
    if(PATHNAME == "donation.html" || PATHNAME == "userIndex.html"){
      location.href = "index.html";
    }
  }
});

var button1 = document.getElementById("loginbutton");
var button2 = document.getElementById("signupbutton");
var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModal'));

button1.addEventListener("click", (e) => {
  e.preventDefault();
  $('#overlay').fadeIn();
  const inputField = document.getElementById("form");
  var email = document.getElementById("exampleInputEmail1").value
  var password = document.getElementById("exampleInputPassword1").value
  var errormsg = document.getElementsByClassName("errormsg")
  setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      $('#overlay').fadeOut();
      inputField.reset();
      myModal.hide();
      location.href = "userIndex.html";
    })

    .catch((error) => {
      $('#overlay').fadeOut();
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      inputField.reset();
    });
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

})

button2.addEventListener("click", (e) => {
  e.preventDefault();
  $('#overlay').fadeIn();
  const inputField = document.getElementById("form");
  var email = document.getElementById("exampleInputEmail1").value
  var password = document.getElementById("exampleInputPassword1").value
  var name = document.getElementById("name").value
  var errormsg = document.getElementsByClassName("errormsg")
  setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      writeUserData(user.uid, name, email);
      inputField.reset();
    })
    .catch((error) => {
      localStorage.clear();
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      $('#overlay').fadeOut();
      inputField.reset();
    });
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
})


if(PATHNAME == "donation.html"){
  const inputFieldp = document.getElementById("donateForm");
  const submit = document.getElementById("psub");
  const breadcrumb = document.getElementById("breadcrumb");
  submit.addEventListener("click", (e)=> {
    e.preventDefault();
    $('#overlay').fadeIn();
    var done = false;
    var user = auth.currentUser;
    var nname = document.getElementById("productname").value;
    var ddesc = document.getElementById("desc").value;
    var loctext = document.getElementById("location").options[document.getElementById("location").selectedIndex].text;
    var context = document.getElementById("condition").options[document.getElementById("condition").selectedIndex].text;
    var img = document.getElementById("image").files[0];
    var imgname = ""; 
    //console.log(img.name);
    if(img){
      imgname = img.name;
      const storageRef = ref_storage(storage, img.name);
      uploadBytes(storageRef, img).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        getDownloadURL(storageRef, img).then(function(url) {
            if(url){
              writeProductData(nname, user, loctext, context, ddesc, url)
            }
            else{
              writeProductData(nname, user, loctext, context, ddesc, imgname)
            }
        });
      });
    }
    else{
      writeProductData(nname, user, loctext, context, ddesc, imgname)
    }
    inputFieldp.reset();
  })
}


if (PATHNAME == "store.html"){
  const urlParams = new URLSearchParams(window.location.search);
  const deleteSuccess = urlParams.get('deleteSuccess');
  if (deleteSuccess === '1') {
    // The page was just reloaded, display the toast:
    //console.log($('.toast').toast('show'))
    $(document).ready(function(){
      $('.toast').toast('show');
      });
  }
  //
  readProductData();
}

if (PATHNAME == "viewproduct.html"){
  var requestBtn = document.getElementById("requestBtn");
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  const list =JSON.parse(localStorage.getItem('list'));
  for (let i = 0; i < list.length; i++) {
      var item = list[i][0];
      if (item == product) {
        $("#pdname").text(list[i][1]);
        $("#pddesc").text(list[i][2]);
        $("#pdimg").attr("src", list[i][3]);
        $("#pdloc").text("meet-up: " + list[i][4]);
        $("#pdcon").text("condition: " + list[i][5]);
        returnUser(list[i][6]);
        requestBtn.addEventListener("click", function(){ change(product,list[i][6]); });
      }
  }
}

if(PATHNAME == "userIndex.html"){
  const userId = localStorage.getItem("uid");
  //var point = document.getElementById("noOfVouch").innerHTML;
  displayProductByUser(userId);
  calculatePoints(userId);

  /*let reward = document.querySelectorAll("#rewardBtn");
  let collect = document.querySelectorAll("#collect");
  for(var i = 0; i< reward.length; i++){
    reward[i].addEventListener("click", ()=> {
      var value = collect[i];
      console.log(value);
      console.log(points);
      console.log(point);
      if(collect[i].innerHTML == "1 point" && points >= 1){
        alert("claimed!");
      }
      else if(collect[i].innerHTML == "2 point" && points >= 2){
        alert("claimed!")
      }
      else{
        alert("not enought points")
      }
    });  
  }*/
}

window.search= search;
function search(){
  var input, filter, div, divCard, a, b, i, txtValue;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  div = document.getElementById("storeCards");
  divCard = div.getElementsByTagName("div");
  for (i = 0; i < divCard.length; i++) {
      a = divCard[i].getElementsByTagName("h5")[0];
      //b = divCard[i].getElementsByTagName("p")[0];
      txtValue = a.textContent || a.innerText; //|| b.textContent || b.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        divCard[i].style.display = "";
      } else {
        divCard[i].style.display = "none";
      }
  }

}

// Save message to firebase
function writeUserData(userId, name, email) {
  set(ref_database(db, 'users/' + userId), {
    username: name,
    email: email,
  }).then(() => {
    $('#overlay').fadeOut();
    myModal.hide();
    location.href = "userIndex.html";
  });
}

function writeProductData(name, user, location, condition, desc, img){
  const newPostKey = push(child(ref_database(db), 'product')).key;
  set(ref_database(db, 'product/' + newPostKey), {
    product_name: name,
    posted_by: user.uid,
    location : location,
    condition: condition,
    description: desc,
    image: img,
    claimed : false,
    requested : false,
    requested_by: "",
  }).then(() => {
    $('#overlay').fadeOut();
    $('.p').toast('show');
    return true;
  });
}


function calculatePoints(uid) {
  var noOfVouchers = 0;
  var numberOfClaimed = 0
  var elem = document.getElementById("myBar");
  var vouch = document.getElementById("asdfgh");
  const dbRef = ref_database(getDatabase());
  get(child(dbRef, "product")).then((snapshot) => {
    snapshot.forEach(function(_child){
      if(_child.val().posted_by == uid){
        var key = _child.key;
        //childkeys.push([key,_child.val().product_name,_child.val().description]);
        //console.log(key);
        if(_child.val().claimed == true){
          numberOfClaimed = numberOfClaimed + 1;
        }
      }
    })
    if (numberOfClaimed > 0) {
      //i = 1;
      var width = 0
      
      if (numberOfClaimed > 4){
        while (numberOfClaimed >= 5){
          noOfVouchers = noOfVouchers + 1;
          numberOfClaimed = numberOfClaimed - 4;
        }
        width = numberOfClaimed*25;
      }
      else {
        width = numberOfClaimed*25;
        if (width == 100){
          noOfVouchers += 1;
        }
      }
      //var id = setInterval(frame, 10);
      /*function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%";
          elem.innerHTML = width + "%";
        }
      }*/
      elem.style.width = width + "%";
      elem.innerHTML = width + "%";
      console.log(noOfVouchers);
      console.log(numberOfClaimed);
    }
    vouch.innerHTML = "Number of vouchers that can be claimed: " + noOfVouchers;
  })
}

var products = [];
window.change= change;
function readProductData(){
  //var childkeys = []
  var productExists = false;
  var storeItems = document.getElementById("storeCards");
  const dbRef = ref_database(getDatabase());
  get(child(dbRef, "product")).then((snapshot) => {
    snapshot.forEach(function(_child){
      if(_child.val().requested == false && _child.val().claimed == false){
        var key = _child.key;
        //childkeys.push([key,_child.val().product_name,_child.val().description]);
        //console.log(key);
        products.push([key,_child.val().product_name,_child.val().description,_child.val().image,_child.val().location,_child.val().condition,_child.val().posted_by])
        var html = `
        <div class="card-full">
          <div class="card cardhover">
            <div class="card-body">
              <a href="viewproduct.html?product=${key}"><img src="${_child.val().image}" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px; cursor: pointer;"></a> 
              <h5 class="card-title text-truncate pt-3"><b>${_child.val().product_name}</b></h5>
              <p class="card-text text-truncate">${_child.val().description}</p>
              <a id="requestBtn" class="btn btn-color" onClick="change('${key}', '${_child.val().posted_by}')">Request</a>
            </div>
          </div>
        </div>
        `
        storeItems.innerHTML += html;
        productExists = true;
      }
    })
    //console.log(products);
    localStorage.setItem("list", JSON.stringify(products));
    if(productExists == false){
      var empty = `<div style="text-align: center;">
                    <img src="images/SPOILER_unknown.png" height="200px" width="auto">
                    <h5>Wow how empty...</h5>
                  </div>`
      storeItems.innerHTML += empty;
    }
  }).catch((error) => {
    console.error(error);
  });
}

window.claimProduct = claimProduct;
function claimProduct(key){
  const claimBtn = document.getElementById("claimBtn");
  const updates = {};
  claimBtn.addEventListener("click", () => {
    const updates = {};
    updates['/product/' + key + '/claimed/'] = true;
    update(ref_database(db), updates);
    location.reload();
    })
}

window.modal=modal;
function displayProductByUser(uid){
  //console.log(uid);
  var productExist = false;
  var requestExist = false;
  const storeItems = document.getElementById("productList");
  const requesters = document.getElementById("requests"); 
  let asd = document.getElementById("empty"); 
  const dbRef = ref_database(getDatabase());
  get(child(dbRef, "product")).then((snapshot) => {
    var i = 1;
    snapshot.forEach(function(_child){
      if(_child.val().posted_by == uid){
        var key = _child.key;
        //childkeys.push([key,_child.val().product_name,_child.val().description]);
        //console.log(key);
        if(_child.val().claimed == true){
          var html = `
          <div class="card-full">
            <div class="card cardhover">
              <div class="card-body">
                <img src="${_child.val().image}" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px; cursor: pointer;">
                <h5 class="card-title text-truncate pt-3"><b>${_child.val().product_name}</b></h5>
                <p class="card-text text-truncate">${_child.val().description}</p>
                <a id="deleteBtn"class="btn btn-color">Claimed</a>
              </div>
            </div>
          </div>
          `
        }
        else{
        var html = `
        <div class="card-full">
          <div class="card cardhover">
            <div class="card-body">
              <img src="${_child.val().image}" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px; cursor: pointer;">
              <h5 class="card-title text-truncate pt-3"><b>${_child.val().product_name}</b></h5>
              <p class="card-text text-truncate">${_child.val().description}</p>
              <a id="deleteBtn" class="btn btn-color" onclick = "modal('${key}')" data-bs-toggle="modal" data-bs-target="#delete">Delete</a>
            </div>
          </div>
        </div>
        `
        }
        //onClick="deleteRef('${key}'
        storeItems.innerHTML += html;
        productExist = true;

        if(_child.val().requested == true && _child.val().claimed == false){
          asd.style.display = "none";
          onValue(ref_database(db, '/users/' + _child.val().requested_by), (snapshot) => {
            var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            var rhtml = `
            <tr>
              <th scope="row">${i}</th>
              <td id="rName">${username}</td>
              <td>${_child.val().product_name}</td>
              <td><a id="chatBtn" href = "https://t.me/NgRayZin" target = "_blank" class="btn btn-color">Chat</a></td>
              <td><a id="acceptBtn" class="btn btn-color" onClick = "claimProduct('${key}');" data-bs-toggle="modal" data-bs-target="#claim");">Accept</a></td>
            </tr>
            `
            requesters.innerHTML +=  rhtml;
            i++;
            requestExist = true;
          });
          //returnUser(_child.val().requested_by);
          //$("#rName").text(name);
        }
      }
    })
    if(productExist == false){
      var empty = `<div style="text-align: center;">
                    <img src="images/SPOILER_unknown.png" height="200px" width="auto">
                    <h5>Wow how empty...</h5>
                  </div>`
      storeItems.innerHTML += empty;
    }
  }).catch((error) => {
    console.error(error);
  });
}

function modal(key){
  //msg.show();
  const deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.addEventListener("click", () => {
    const updates = {};
    updates['/product/' + key] = null
    update(ref_database(db), updates);
    location.reload();
    })
  
}

function change(key,poster){
  //console.log(key);
  //console.log(poster);
  var user = auth.currentUser;
  if(user){
    var userId = auth.currentUser.uid;
    const newPostKey = push(child(ref_database(db), 'product')).key;
    const updates = {};
    updates['/product/' + key + '/requested/'] = true;
    updates['/product/' + key + '/requested_by/'] = userId;
    if(poster == userId){
      alert("cant claim your own product");
    }
    else{
      update(ref_database(db), updates).then(() =>{
        window.location.href = "store.html" + '?deleteSuccess=1';
      });
      //location.reload();
      /*$('.toast').toast('show');
      const url = new URL(window.location.href);
      url.searchParams.set('deleteSuccess', 1);
      //var newpath = "store.html" + '?deleteSuccess=1';
      //window.location.replace(newpath);*/
    }
  }
  else{
    myModal.show();
    return false
  } 
}

//return user name
function returnName() {
  const userId = auth.currentUser.uid;
  return onValue(ref_database(db, '/users/' + userId), (snapshot) => {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    document.getElementById("Nameholder").innerText = username;
    if(PATHNAME == "userIndex.html"){
      document.getElementById("pdusername").innerText = username; //"Welcome back " + username+"!👋";
    }
  }, {
    onlyOnce: true
  });
}

function returnUser(userKey){
  return onValue(ref_database(db, '/users/' + userKey), (snapshot) => {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    var email = (snapshot.val() && snapshot.val().email) || 'Anonymous';
    //pduser
    $("#pduser").text("posted by: " +username);
  }, {
    onlyOnce: true
  });

}


let toggle = document.getElementById("toggle");
let signup = document.getElementById("signup");
let loginbutton = document.getElementById("login");
let change1 = document.getElementById("change1");
let change2 = document.getElementById("change2");

signup.style.display = "none";

toggle.addEventListener("click", () => {
  if (signup.style.display === "none") {
    signup.style.display = "block"
    loginbutton.style.display = "none"
    change1.innerText = "Already have an account? Click"
    change2.innerText = "to login"
  }
  else {
    signup.style.display = "none"
    loginbutton.style.display = "block"
    change1.innerText = "Don't have an account? Click"
    change2.innerText = "to sign up"
  }

})


window.addEventListener("scroll", reveal);

// To check the scroll position on page load
reveal();

function reveal() {
  var reveals = document.querySelectorAll(".reveal");
  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

//set(ref_database(db, 'product/' + user.uid + name)

/*const msgScreen = document.getElementById("messages"); 
const msgForm = document.getElementById("messageForm");
const msgInput = document.getElementById("msg-input"); 
const msgBtn = document.getElementById("msg-btn");

msgForm.addEventListener('submit', sendMessage);
msgRef.on('child_added', updateMsgs);*/

/*const updateMsgs = data =>{
  const {email: userEmail , user, text} = data.val();
  //Check the encrypting mode
  var encryptMode = fetchJson();
  var outputText = text;
  
  if(encryptMode == "nr"){
    outputText = normalEncrypt(outputText);
  }else if(encryptMode == "cr"){
    outputText = crazyEncrypt(outputText);
  }
  
  //load messages
  const msg = `<li class="${dataName == name ? "msg my": "msg"}"><span class = "msg-span">
  <i class = "name">${name}: </i>${text}
  </span>
  </li>`
  msgScreen.innerHTML += msg;
  document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
  //auto scroll to bottom
}

function sendMessage(e){
  e.preventDefault();
  const text = msgInput.value;
    if(!text.trim()) return alert('Please type your message'); //no msg submitted
    const msg = {
        email,
        name,
        text: text
    };
    msgRef.push(msg);
    msgInput.value = "";
}*/

/*function writemessage(userid, name, text){
  set(ref_database(db, 'msg/' + userid), {
    //index of the msg to find out order of msgs 
    index: index,
    name: name,
    user: userid,
    text : text,
  });
}
*/



/*var products = [];
var databaseRef = db.ref("product");
databaseRef.on('child_added', function(snapshot) {
  var product = snapshot.val()
  products.push({
    claimed: product.claimed, 
    condition: product.condition,
    description: product.description,
    image: product.image,
    posted_by: product.posted_by,
    product_name: product.product_name
  });
});*/

// if(PATHNAME == "viewproduct.html"){
//   let content = ""
//   for (var i = 0; i < products.length; i++) {
//     content = `${content}<div class="card-full">
//                             <div class="card">
//                               <div class="card-body">
//                                 <img src="images/20220108_194432.jpg" class="card-img-top pt-1" alt="..." height="170px" width="auto" style="border-radius:5px;">
//                                 <h5 class="card-title pt-3"><b>${products[i].product_name}</b></h5>
//                                 <p class="card-text">${products[i].description}</p>
//                                 <a href="#" class="btn btn-color">Request</a>
//                               </div>
//                             </div>
//                           </div>`
//   }
//   $("#storeCards div").html(content);
// }