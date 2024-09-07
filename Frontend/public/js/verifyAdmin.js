var localStorageToken = localStorage.getItem("token");

if (!localStorageToken) {
  location.assign("http://localhost:3001/error.html");
}

let headers = {
  authorization: "Bearer " + localStorageToken,
};

$.ajax({
  headers: headers,
  url: "http://localhost:8081/verify/admin",
  type: "GET",
  contentType: "application/json",
  success: (data, status, xhr) => {
    console.log("success");
  },
  error: (xhr, status, err) => {
    console.log(err);
    location.assign("http://localhost:3001/error.html");
  },
});
