var modal = document.getElementById("makenew");
var modal1 = document.getElementById("edit");
var btn = document.getElementById("addnew");
var btn1 = document.getElementsByClassName("edit_btn")[0];
var ers = document.getElementById("filter");
var span1 = document.getElementsByClassName("close_edit")[0];
var span = document.getElementsByClassName("close")[0];


// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
    ers.style.display = "block";
  }

span.onclick = function() {
    modal.style.display = "none";
    ers.style.display = "none";

  }

// When the user clicks on the button, open the modal
btn1.onclick = function() {
  modal1.style.display = "block";
  ers.style.display = "block";
}

span1.onclick = function() {
  modal1.style.display = "none";
  ers.style.display = "none";

}