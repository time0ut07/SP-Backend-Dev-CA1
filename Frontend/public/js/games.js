$(".input_text").focus(function () {
  $(this).prev(".fas").addClass("glowIcon");
});

$(".input_text").focusout(function () {
  $(this).prev(".fas").removeClass("glowIcon");
});

function appendGamesContainer(game) {
  const wrapperElement = document.getElementById("startOfGames");

  const newContainer = document.createElement("div");
  newContainer.className = "games_container";
  newContainer.innerHTML = `
    <div class="games">
      <img src="${game.filepath}.jpeg" alt="" class="img" id="img">
      <div class="game_information">
        <h2 id="game_title">${game.title}</h2>
        <p id="game_info">${game.description}</p>
        <p id="year_release">Year of release</p>
        <p id="year">${game.year}</p>
        <div class="platform" id="platform">
          <div class="plat" id="plat">
            Platform
          </div>
          <div class="platforms" id="platforms">
            ${game.platformname}
          </div>
        </div>
        <div class="price" id="price">
          <p>Price</p>
          <p class="data_price">$${game.price.toFixed(2)}</p>
        </div>
        <div class="btns" id="btns">
          <div class="buy_btn" id="buy_btn">
            <button class="button">
              <a href="http://localhost:3001/game/${game.gameid}/${game.platformname}" id="explore">EXPLORE</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const lastContainer = wrapperElement.querySelector(
    ".games_container:last-child"
  );

  let lastContainerHeight = 0;
  let lastContainerMarginTop = 250;

  if (lastContainer) {
    lastContainerHeight = lastContainer.offsetHeight;
    lastContainerMarginTop = parseFloat(
      getComputedStyle(lastContainer).marginTop
    );
  }

  const newContainerMarginTop =
    lastContainerMarginTop + lastContainerHeight + 50;

  newContainer.style.marginTop = `${newContainerMarginTop}px`;

  wrapperElement.appendChild(newContainer);
}

function clearGamesContainer() {
  const gamesContainer = document.getElementById("startOfGames");
  gamesContainer.innerHTML = "";
}
