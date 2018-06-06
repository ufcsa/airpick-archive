(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController() {
    var vm = this;

    //open or close the collapsible
    var colls = document.getElementsByClassName("collapsible");
    for (var i = 0; i < colls.length; i++) {
      colls[i].addEventListener("click", function () {
        var detail = this.nextElementSibling;
        if (detail.style.display === 'block') {
          detail.style.display = 'none';
          this.classList.remove("active");
        } else {
          detail.style.display = 'block';
          this.classList.add("active");
        }
      });
    }
  }

}

());

