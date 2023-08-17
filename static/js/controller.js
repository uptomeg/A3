/*
 * controller.js
 *
 * Write all your code here.
 */
// const input = document.querySelector("input");
// const log = document.getElementById("notification");

// input.addEventListener("input", updateValue);


// function updateValue(e) {
//   log.textContent = e.target.value;
// }
document.addEventListener("DOMContentLoaded", () => {
const form = document.querySelector('form.form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password1');
const repeatPasswordInput = document.getElementById('password2');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

const usernameNotification = document.getElementById('username_notification');
const passwordNotification = document.getElementById('password1_notification');
const repeatPasswordNotification = document.getElementById('password2_notification');
const emailNotification = document.getElementById('email_notification');
const phoneNotification = document.getElementById('phone_notification');
const mainNotification = document.getElementById('notification');

function showError(input, notification, message) {
    input.style.backgroundColor = 'red';
    notification.innerText = message;
}

function clearError(input, notification) {
    input.style.backgroundColor = '';
    notification.innerText = '';
  }

function validateUsername() {
  const username = usernameInput.value;
  const usernameRegex = /^[a-zA-Z0-9_]{6,}$/;

  if (!usernameRegex.test(username)) {
    showError(usernameInput, usernameNotification, 'Username is invalid');
    return false;
  } else {
    clearError(usernameInput, usernameNotification);
    return true;
  }
}

function validatePassword() {
  const password = passwordInput.value;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  validateRepeatPassword();
  if (!passwordRegex.test(password)) {
    showError(passwordInput, passwordNotification, 'Password is invalid');
    return false;
  } else {
    clearError(passwordInput, passwordNotification);
    return true;
  }
}

function validateRepeatPassword() {
  const password = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  if (password !== repeatPassword) {
    showError(repeatPasswordInput, repeatPasswordNotification, "Passwords don't match");
    return false;
  } else {
    clearError(repeatPasswordInput, repeatPasswordNotification);
    return true;
  }
}

function validateEmail() {
  const email = emailInput.value;
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

  if (!emailRegex.test(email)) {
    showError(emailInput, emailNotification, 'Email is invalid');
    return false;
  } else {
    clearError(emailInput, emailNotification);
    return true;
  }
}

function validatePhone() {
  const phone = phoneInput.value;
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

  if (!phoneRegex.test(phone)) {
    showError(phoneInput, phoneNotification, 'Phone is invalid');
    return false;
  } else {
    clearError(phoneInput, phoneNotification);
    return true;
  }
}

function validateForm() {
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();
  const isRepeatPasswordValid = validateRepeatPassword();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();

  return isUsernameValid && isPasswordValid && isRepeatPasswordValid && isEmailValid && isPhoneValid;
}

function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    mainNotification.innerText = 'At least one field is invalid. Please correct it before proceeding';
    return;
  }

  mainNotification.innerText = '';

  const data = {
    username: usernameInput.value,
    password1: passwordInput.value,
    password2: repeatPasswordInput.value,
    email: emailInput.value,
    phone: phoneInput.value
  };

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.status === 200) {
        mainNotification.innerText = 'User added';
      } else if (response.status === 409) {
        showError(usernameInput, usernameNotification, 'Username has already been taken');
      } else {
        mainNotification.innerText = 'Unknown error occurred';
      }
    })
    .catch(() => {
      mainNotification.innerText = 'Unknown error occurred';
    });
}

usernameInput.addEventListener('input', validateUsername);
passwordInput.addEventListener('input', validatePassword);
repeatPasswordInput.addEventListener('input', validateRepeatPassword);
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);
form.addEventListener('submit', handleSubmit);
});








//part2
document.addEventListener("DOMContentLoaded", () => {
  const addUpdateItemButton = document.getElementById("add_update_item");
  const itemName = document.getElementById("name");
  const itemPrice = document.getElementById("price");
  const itemQuantity = document.getElementById("quantity");
  const itemNotification = document.getElementById("item_notification");
  const cartItems = document.getElementById("cart-items").querySelector("tbody");
  const subtotalDisplay = document.getElementById("subtotal");
  const taxesDisplay = document.getElementById("taxes");
  const grandTotalDisplay = document.getElementById("grand_total");

  let cart = {};

  function updateCart() {
    let subtotal = 0;
    for (const item of Object.values(cart)) {
      subtotal += item.total;
    }

    let taxes = subtotal * 0.13;
    let grandTotal = subtotal + taxes;

    subtotalDisplay.textContent = subtotal.toFixed(2);
    taxesDisplay.textContent = taxes.toFixed(2);
    grandTotalDisplay.textContent = grandTotal.toFixed(2);
  }

  function updateItemRow(item) {
    let row = document.getElementById(item.name.replace(" ", "_"));
    row.querySelector(".price").textContent = `$${item.price.toFixed(2)}`;
    row.querySelector(".quantity").textContent = item.quantity;
    row.querySelector(".total").textContent = `$${item.total.toFixed(2)}`;
  }

  function createItemRow(item) {
    let row = document.createElement("tr");
    row.id = item.name.replace(" ", "_");

    row.innerHTML = `
      <td class="name">${item.name}</td>
      <td class="price">$${item.price.toFixed(2)}</td>
      <td class="quantity">${item.quantity}</td>
      <td class="total">$${item.total.toFixed(2)}</td>
      <td><button class="btn decrease">-</button></td>
      <td><button class="btn increase">+</button></td>
      <td><button class="btn delete">delete</button></td>
    `;

    row.querySelector(".decrease").addEventListener("click", () => {
      item.quantity = Math.max(0, item.quantity - 1);
      item.total = item.price * item.quantity;
      updateItemRow(item);
      updateCart();
    });

    row.querySelector(".increase").addEventListener("click", () => {
      item.quantity++;
      item.total = item.price * item.quantity;
      updateItemRow(item);
      updateCart();
    });

    row.querySelector(".delete").addEventListener("click", () => {
      delete cart[item.name];
      cartItems.removeChild(row);
      updateCart();
    });

    cartItems.appendChild(row);
  }

  addUpdateItemButton.addEventListener("click", () => {
    let name = itemName.value.trim();
    let price = parseFloat(itemPrice.value);
    let quantity = parseInt(itemQuantity.value, 10);

    if (!name || isNaN(price) || isNaN(quantity)) {
      itemNotification.textContent = "Name, price, or quantity is invalid";
      return;
    }

    itemNotification.textContent = "";
    itemName.value = "";
    itemPrice.value = "";
    itemQuantity.value = "";

    if (cart[name]) {
      cart[name].price = price;
      cart[name].quantity = quantity;
      cart[name].total = price * quantity;
      updateItemRow(cart[name]);
    } else {
      let item = new Item(name, price, quantity);
      cart[name] = item;
      createItemRow(item);
    }

    updateCart();
  });
});






//part3
// document.addEventListener('DOMContentLoaded', () => {
//   let currentPage = 1;
//   let reachedEnd = false;

//   const fetchData = async (paragraph) => {
//       try {
//           const response = await fetch(`/text/data?paragraph=${paragraph}`);
//           const data = await response.json();
//           return data;
//       } catch (error) {
//           console.error('Error fetching data:', error);
//       }
//   };

//   const updateLikes = async (paragraph) => {
//       try {
//           const response = await fetch('/text/like', {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ paragraph }),
//           });
//           const data = await response.json();
//           return data;
//       } catch (error) {
//           console.error('Error updating likes:', error);
//       }
//   };

//   const renderData = (data) => {
//       const container = document.getElementById('data');
//       data.forEach((item) => {
//           const { paragraph, likes, content } = item;

//           const paragraphDiv = document.createElement('div');
//           paragraphDiv.id = `paragraph_${paragraph}`;

//           const p = document.createElement('p');
//           p.innerHTML = `${content} <b>(Paragraph: ${paragraph})</b>`;
//           paragraphDiv.appendChild(p);

//           const likeButton = document.createElement('button');
//           likeButton.classList.add('like');
//           likeButton.textContent = `Likes: ${likes}`;
//           likeButton.addEventListener('click', async () => {
//               const updatedData = await updateLikes(paragraph);
//               likeButton.textContent = `Likes: ${updatedData.data.likes}`;
//           });

//           paragraphDiv.appendChild(likeButton);
//           container.appendChild(paragraphDiv);
//       });
//   };

//   const checkScrollPosition = () => {
//       if (
//           window.innerHeight + window.scrollY >= document.body.offsetHeight &&
//           !reachedEnd
//       ) {
//           loadContent();
//       }
//   };

//   const loadContent = async () => {
//       const data = await fetchData(currentPage);
//       if (!data.next) {
//           reachedEnd = true;
//           const container = document.getElementById('data');
//           const endMessage = document.createElement('p');
//           endMessage.innerHTML = '<b>You have reached the end.</b>';
//           container.appendChild(endMessage);
//       } else {
//           renderData(data.data);
//           currentPage += 5;
//       }
//   };

//   window.addEventListener('scroll', checkScrollPosition);
//   loadContent();
//});


document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  let reachedEnd = false;

  const fetchData = async (paragraph) => {
      try {
          const response = await fetch(`/text/data?paragraph=${paragraph}`);
          const data = await response.json();
          return data;
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  const updateLikes = async (paragraph) => {
      try {
          const response = await fetch('/text/like', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ paragraph }),
          });
          const data = await response.json();
          return data;
      } catch (error) {
          console.error('Error updating likes:', error);
      }
  };

  const renderData = (data) => {
      const container = document.getElementById('data');
      data.forEach((item) => {
          const { paragraph, likes, content } = item;

          const paragraphDiv = document.createElement('div');
          paragraphDiv.id = `paragraph_${paragraph}`;

          const p = document.createElement('p');
          p.innerHTML = `${content} <b>(Paragraph: ${paragraph})</b>`;
          paragraphDiv.appendChild(p);

          const likeButton = document.createElement('button');
          likeButton.classList.add('like');
          likeButton.textContent = `Likes: ${likes}`;
          likeButton.addEventListener('click', async () => {
              const updatedData = await updateLikes(paragraph);
              likeButton.textContent = `Likes: ${updatedData.data.likes}`;
          });

          paragraphDiv.appendChild(likeButton);
          container.appendChild(paragraphDiv);
      });
  };

  const checkScrollPosition = () => {
      if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight &&
          !reachedEnd
      ) {
          loadContent();
      }
  };

  const loadContent = async () => {
      const data = await fetchData(currentPage);
      if (!data.next) {
          reachedEnd = true;
          const container = document.getElementById('data');
          const endMessage = document.createElement('p');
          endMessage.innerHTML = '<b>You have reached the end.</b>';
          container.appendChild(endMessage);
      } else {
          renderData(data.data);
          currentPage += 5;
      }
  };

  window.addEventListener('scroll', checkScrollPosition);

  // Initial load
  loadContent();
});