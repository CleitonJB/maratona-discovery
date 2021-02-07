const Modal = {
  open() {
    document.querySelector(".overlay-container").classList.add("active");
  },

  close() {
    document.querySelector(".overlay-container").classList.remove("active");
  },

  toggle() {
    document.querySelector(".overlay-container").classList.toggle("active");
  }
};