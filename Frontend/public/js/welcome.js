// --------------------------Up--------------------------

var upObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");
      return;
    }
  });
});

var upElements = document.getElementsByClassName("fade-up");
for (var i = 0; i < upElements.length; i++) {
  upObserver.observe(upElements[i]);
}

// --------------------------Down--------------------------

var downObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-down");
      return;
    }
  });
});

var downElements = document.getElementsByClassName("fade-down");
for (var i = 0; i < downElements.length; i++) {
  downObserver.observe(downElements[i]);
}

// --------------------------Left--------------------------

var leftObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-left");
      return;
    }
  });
});

var leftElements = document.getElementsByClassName("fade-left");
for (var i = 0; i < leftElements.length; i++) {
  leftObserver.observe(leftElements[i]);
}

// --------------------------Right--------------------------

var rightObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-right");
      return;
    }
  });
});

var rightElements = document.getElementsByClassName("fade-right");
for (var i = 0; i < rightElements.length; i++) {
  rightObserver.observe(rightElements[i]);
}
