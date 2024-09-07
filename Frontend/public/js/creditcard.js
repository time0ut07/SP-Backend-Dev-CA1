function updateCartContainerHeight() {
  const cartContainer = $("#cart_container")[0];
  const cartContentsHeight = $("#cart_container").prop("scrollHeight");
  const cartContainerHeight = cartContainer.clientHeight;

  if (cartContentsHeight > cartContainerHeight) {
    // If the content height exceeds the container height, set the container's height to fit the content
    cartContainer.style.height = cartContentsHeight + "px";
  }
}

function validateForm() {
  // Check if all required fields are filled
  const requiredFields = [
    "card_name",
    "card_number",
    "expire",
    "cvv",
    "fname",
    "lname",
    "city",
    "country",
    "address",
    "pcode",
    "pnumber",
  ];
  console.log("yesy")
  for (const field of requiredFields) {
    const fieldValue = $(`#${field}`).val().trim();
    console.log(fieldValue)
    if (fieldValue === "") {
      return false; // Required field is empty, return false
    }
  }

  return true; // All required fields are filled, return true
}

