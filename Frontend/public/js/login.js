// icon to glow

$(".input_text").focus(function () {
  $(this).prev(".fa").addClass("glowIcon");
});

$(".input_text").focusout(function () {
  $(this).prev(".fa").removeClass("glowIcon");
});

// show password

$(document).ready(() => {
  $("#showPassword").click(() => {
    const passwordField = $("#password input");
    const passwordIcon = $("#showPassword");
    const showPassword = passwordField.attr("type") === "password";

    if (showPassword) {
      passwordField.attr("type", "text");
      passwordIcon.removeClass("fa-eye-slash").addClass("fa-eye");
    } else {
      passwordField.attr("type", "password");
      passwordIcon.removeClass("fa-eye").addClass("fa-eye-slash");
    }
  });

  $("#showConfirmPassword").click(() => {
    const confirmPasswordField = $("#confirmPassword input");
    const confirmPasswordIcon = $("#showConfirmPassword");
    const showConfirmPassword =
      confirmPasswordField.attr("type") === "password";

    if (showConfirmPassword) {
      confirmPasswordField.attr("type", "text");
      confirmPasswordIcon.removeClass("fa-eye-slash").addClass("fa-eye");
    } else {
      confirmPasswordField.attr("type", "password");
      confirmPasswordIcon.removeClass("fa-eye").addClass("fa-eye-slash");
    }
  });

    $("#showOldPassword").click(() => {
    const confirmPasswordField = $("#oldPassword input");
    const confirmPasswordIcon = $("#showOldPassword");
    const showConfirmPassword =
      confirmPasswordField.attr("type") === "password";

    if (showConfirmPassword) {
      confirmPasswordField.attr("type", "text");
      confirmPasswordIcon.removeClass("fa-eye-slash").addClass("fa-eye");
    } else {
      confirmPasswordField.attr("type", "password");
      confirmPasswordIcon.removeClass("fa-eye").addClass("fa-eye-slash");
    }
  });

});

