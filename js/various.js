
// PART 1 - ASIDE MENU

$(document).ready(function () {
  $(".toggle").click(function () {
    $("aside").toggleClass("close");
  });
});

$(document).mouseup(function (e) {
  var container2 = $("aside");
  if (!container2.is(e.target) && container2.has(e.target).length === 0) {
    $("aside").removeClass("close");
  }
});


// PART 3 - SPACECAT SCROLL

$(document).ready(function () {
  $(window).scroll(function () {
    var scrollP = $(this).scrollTop();
    console.log(scrollP);

    $(".spacecats").css({
      transform: "translate(" + scrollP + "px ," + scrollP / 1.6 + "px)"
    });
  });
});
