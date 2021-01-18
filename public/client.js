

var socket = io(url)
socket.on("connect",function(){
    console.log("connected");
});




function signup() {
    
    axios({
        method: 'post',
        url: 'http://localhost:3000/signup',
        // url: 'https://forgetpasswordserver.herokuapp.com/signup',
        data: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            
        },
        withCredentials:true
    })
    .then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./login.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false;
}
function login() {
    axios({
        method: 'post',
        url: 'http://localhost:3000/login',
        // url: 'https://forgetpasswordserver.herokuapp.com/login',
        withCredentials: true,
        data: {

            email: document.getElementById('Lemail').value,
            password: document.getElementById('Lpass').value,

        }
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./profile.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false;
}
function getProfile() {
    axios({
        method: 'get',
        url: 'http://localhost:3000/profile',
        credentials: 'include',
    }).then((response) => {
        console.log(response);
        document.getElementById('pName').innerHTML = response.data.profile.name
        document.getElementById('pPhone').innerHTML = response.data.profile.phone
        document.getElementById('pEmail').innerHTML = response.data.profile.email
    }, (error) => {
        console.log(error.message);
        location.href = "./login.html"
    });
    return false
}
function logout() {
    axios({
        method: 'post',
        url: 'http://localhost:3000/logout',
    }).then((response) => {
        console.log(response);
        location.href = "./login.html"
    }, (error) => {
        console.log(error);
    });
    return false
}
function forget_password() {

    var email = document.getElementById('email12').value
    localStorage.setItem("email",email)

    axios({
        method: 'post',
        url: 'http://localhost:3000/forget_password',
        // url: 'https://forgetpasswordserver.herokuapp.com/login',
        withCredentials: true,
        data: {
         email:email
        }
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./forget_pass_code.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false;
}
function forget_password_step_2() {
    var email22 = localStorage.getItem("email")
    axios({
        method: 'post',
        url: 'http://localhost:3000/forget_password_step_2',
        // url: 'https://forgetpasswordserver.herokuapp.com/login',
        withCredentials: true,
        data: {
            email:email22,
            code: document.getElementById('code').value,
            newPass: document.getElementById('newpass').value,
           }
    }).then((response) => {
       console.log(response);
       alert(response.data)
       location.href = "./login.html"
    }).catch((error) => {
        console.log(error);
    });
    return false;
}
function getProfile(){
    axios({
        method:'get',
        url:'http://localhost:3000/profile',
        credentials:'include',
    }).then((response)=>{
        document.getElementById("pName").innerHTML=response.data.profile.name
    },(error)=>{
        location.href = "./login.html"
    });
    return false;
}
function post() {
    axios({
        method: 'post',
        url: 'http://localhost:3000//tweet',
        credentials: 'include',
        data: {
            userName: document.getElementById('pName').innerHTML,
            tweet: document.getElementById('tweet').value,
        },
    }).then((response) => {
        console.log(response.data.data);
        document.getElementById('userPosts').innerHTML += `
    <div class="posts">
    <h4>${response.data.data.name}</h4>
    
    <p>${response.data.data.tweets}</p>
    </div>
    `
    }, (error) => {
        console.log(error.message);
    });
    document.getElementById('tweet').value = "";
    return false
}

function getTweets() {
    axios({
        method: 'get',
        url: 'http://localhost:3000/getTweets',
        credentials: 'include',
    }).then((response) => {
        let tweets = response.data;
        let html = ""
        tweets.forEach(element => {
            html += `
            <div class="posts">
            <h4>${element.name}</h4>
            
            <p class="noteCard">${element.tweets}</p>
            </div>
            `
        });
        document.getElementById('posts').innerHTML = html;

        let userTweet = response.data
        let userHtml = ""
        let userName = document.getElementById('pName').innerHTML;
        userTweet.forEach(element => {
            if (element.name == userName) {
                userHtml += `
                <div class="posts">
                <h4>${element.name}</h4>
            
                <p class="noteCard">${element.tweets}</p>
                </div>
                `
            }
        });
        document.getElementById('userPosts').innerHTML = userHtml;
    }, (error) => {
        console.log(error.message);
    });
    return false
}

function getUsers() {
    axios({
        method: 'get',
        url: url + '/getUsers',
        credentials: 'include',
    }).then((response) => {
        let users = response.data;
        let usersHtml = ""
        users.forEach(element => {
            usersHtml += `
            <div class="posts">
            <h4>${element.name}</h4>
            <p>${element.phone}</p>
            <p class="noteCard">${element.email}</p>
            </div>
            `
        });
        document.getElementById('users').innerHTML = usersHtml;

    }, (error) => {
        console.log(error.message);
    });
    return false
}


socket.on('NEW_POST', (newPost) => {
    console.log(newPost)
    let tweets = newPost;
    document.getElementById('posts').innerHTML += `
    <div class="posts">
    <h4>${tweets.name}</h4>
    <p>${tweets.tweets}</p>
    </div>
    `
})
document.getElementById('profile').style.display = "none"
document.getElementById('usersSection').style.display = "none"
function showHome() {
    document.getElementById('profile').style.display = "none"
    document.getElementById('home').style.display = "block"
    document.getElementById('usersSection').style.display = "none"

}


function showProfile() {
    document.getElementById('home').style.display = "none"
    document.getElementById('profile').style.display = "block"
    document.getElementById('usersSection').style.display = "none"

}

function showUsers() {
    document.getElementById('home').style.display = "none"
    document.getElementById('profile').style.display = "none"
    document.getElementById('usersSection').style.display = "block"

}
