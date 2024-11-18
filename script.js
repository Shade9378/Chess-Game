window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
  };

function openAndCloseSideBar() {
    let sidebar = document.getElementById("sidebar");

    if (sidebar.style.width === "350px") {
        sidebar.style.width = "0";  

    } else {
        sidebar.style.width = "350px"; 

    }
}
