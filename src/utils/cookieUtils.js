export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

// References:
// https://www.w3schools.com/js/js_cookies.asp#:~:text=Change%20a%20Cookie%20with%20JavaScript,The%20old%20cookie%20is%20overwritten.

