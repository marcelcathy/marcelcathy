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
