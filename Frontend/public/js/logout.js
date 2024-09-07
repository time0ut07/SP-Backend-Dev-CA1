$('#logout').click(() => {
    localStorage.clear()
    location.assign("http://localhost:3001/login.html")
    location.reload();
})