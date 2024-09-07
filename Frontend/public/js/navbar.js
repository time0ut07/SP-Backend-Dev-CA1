/* Alden Chia Yu Xiang
2205584
DISM/FT/2A/01 */

$("#navbar").append(`
<div class="navbar" id="navbar">
    <div class="content" id="content">
        <a class="logo" id="logo" href="http://localhost:3001/index.html">sp_games</a>
         <a href="http://localhost:3001/index.html" id="home">
            <i class="fas fa-home" id="home_icon"></i>
        </a>
       
        <a href="http://localhost:3001/games.html" id="games">
            <i class="fas fa-gamepad" id="game_icon"></i>
        </a>
       
        <a href="http://localhost:3001/profile.html" id="profile">
            <i class="fas fa-user" id="profile_icon"></i>
        </a>
       
        <a href="http://localhost:3001/cart.html" id="cart">
            <i class="fas fa-shopping-cart" id="cart_icon"></i>
        </a>
       
    </div>
`);

if (localStorage.length != 0) {
    $("#navbar").append(`
        <a href="http://localhost:3001/login.html" id="logout">
            Logout
        </a>
    </div>
    `);

    var localStorageData = localStorage.getItem("userData");
    var userData = JSON.parse(localStorageData);
    var memberType = userData[0].member_type;

    if (memberType == 'Admin') {
        $("#navbar").append(`
            <a href="http://localhost:3001/admin.html" id="admin">
                Admin Panel
            </a>
        </div>
        `);
    }
} else {
    $("#navbar").append(`
        <a href="http://localhost:3001/login.html" id="login">
            Login
        </a>
    </div>  
    `);
}



$("#navbar").on("click", "#logout", () => {
  localStorage.clear();
  location.href = "http://localhost:3001/login.html";
});


$(document).ready(() => {
  // ... your existing code ...

  // Check the current page URL and set the active class to the corresponding anchor tag
  const currentPageURL = window.location.href;
  if (currentPageURL.includes("games.html")) {
    $("#games").addClass("active");

    $("#navbar").append(`
            <a href="http://localhost:3001/profile.html" id="yourgames">
                Your Games
            </a>
        </div>
        `);

  }
});