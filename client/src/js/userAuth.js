async function userAuthentication() {
    try {
        const response = await fetch("/users/auth");

        if (!response.ok) {
            return console.error("Problem fetching persistent login authentication");
        }

        const data = await response.json();

        if (data && data.user) {
            data.user.date = Date.now();
            localStorage.setItem("user", JSON.stringify(data.user, null, 2));
        }
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", userAuthentication);