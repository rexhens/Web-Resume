function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
   
    //this function just adds the open class to the element
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}