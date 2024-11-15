function loginCheck() {
    const loginSection = document.querySelector(".login");
    const userDisplay = document.querySelector(".user-display");
    const userNameDisplay = document.getElementById("user-display-name");
    
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        loginSection.style.display = "none";
        userDisplay.style.display = "flex";
        userNameDisplay.textContent = user.username;
        
        // userDisplay.addEventListener("click", () => {
        //     window.location = ""
        // });
    }
}

document.addEventListener("DOMContentLoaded", loginCheck);