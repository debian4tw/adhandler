
function prepareFrame() {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", "http://localhost:3000");
  ifrm.style.width = "400px";
  ifrm.style.height = "250px";
  document.getElementById('if-container').appendChild(ifrm);
}
prepareFrame();