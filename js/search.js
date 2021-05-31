/**
// For use with PHP & MySQL
$(document).ready(function(){
  $('.search-box input[type="text"]').on("keyup input", function() {
    var inputVal = $(this).val();
    var resultDropdown = $(this).siblings(".result");

    if (inputVal.length > 2) {
      $.get("backend-autofill", {term: inputVal}).done(function(data) {
        resultDropdown.html(data);
      });
    } else {
      resultDropdown.empty();
    }
  });

  $(document).on("click", ".result p", function() {
    $(this).parents(".search-box").find('input[type="text"]').val($(this).text());
    $(this).parent(".result").empty();
  });
});
**/

// Read from CSV file
function processData(allText) {
  var record_num = 2; // or however many elements there are in each row
  var allTextLines = allText.match(/[^\r\n]+/g);
  var guests = [];
  var headings = {};
  while (allTextLines.length > 0) {
    var guest = {}, entry;
    var line = allTextLines.shift();
    if (line.indexOf(',') > -1) {
      entry = line.trim().split(',');
      if (entry.length === 2) {
        guest['name'] = entry[0].trim();
        guest['family_id'] = entry[1].trim();
        guests.push(guest);
      }
    }
  }
  return guests;
}

function onSearchInput(guests) {
  $('.search-box input[type="text"]').on("keyup input", function() {
    var inputVal = $(this).val();
    var resultDropdown = $(this).siblings(".result");

    if (inputVal.length > 2) {
      var matchingGuests = getGuestNames(findMatchingGuests(guests, inputVal));
      if (matchingGuests !== null && matchingGuests.length > 0) {
        resultDropdown.empty();
        matchingGuests.forEach((guest) => {
          resultDropdown.append($("<li></li>").val(guest).html(guest));
        })
      } else {
        resultDropdown.empty();
      }
    } else {
      resultDropdown.empty();
    }
  });

  $(document).on("click", ".result li", function() {
    $(this).parents(".search-box").find('input[type="text"]').val($(this).text());
    $(this).parent(".result").empty();
  });
}

function findMatchingGuests(guests, inputVal) {
  var guest = [];
  guests.forEach((entry) => {
    if (entry['name'].toLowerCase().indexOf(inputVal.toLowerCase()) !== -1) {
      guest.push(entry);
    }
  })
  return guest;
}

function disableSearch() {
  // $(".seach-container").fadeOut('slow')
  // $(".seach-container").fadeIn('slow')
  var button = document.getElementById("search-button");
  button.setAttribute("disabled", "disabled");
  button.style.cursor = "not-allowed";
  var searchText = document.getElementById("search-name");
  searchText.setAttribute("disabled", "disabled");
}

function populateGuestsTable(guests, matchingGuest) {
  var family = findFamily(guests, matchingGuest[0]['family_id']);
  // console.log(family);

  // var form = document.getElementById("rsvp-form");
  $parentForm = $("#rsvp-form");
  family.forEach((member) => {
    var memberId = member.toLowerCase().replace(/[\W]+/g,'');
    var rsvpGuestId = "guest-" + memberId;
    var form = $("<div class='rsvp-guest' id='" + rsvpGuestId + "'>").appendTo("#rsvp-form");

    var pics = ["Images/cat1.png", "Images/cat2.png", "Images/cat3.png"];
    var randomPic = pics[Math.floor(Math.random() * pics.length)];
    var avatarId = "avatar-" + memberId;
    var avatar = $("<div class='rsvp-avatar' id='"+avatarId+"'>").appendTo("#"+rsvpGuestId);
    avatar.append("<img src='"+randomPic+"'/>")
    avatar.append("<br/>");

    // var attending = $("<label for='attending' class='attending'>").appendTo("#"+rsvpGuestId);
    var attending = $("<label for='attending' class='attending'>").appendTo("#"+avatarId);
    attending.append("<input id='name' type='text' name='name' value='" + member + "' readonly/>");
    attending.append("<input type='checkbox' id='attending-"+memberId+"' name='attending' onClick='isAttending(this)'>").appendTo("#"+rsvpGuestId);
    attending.append("<span class='checkmark'></span>");
    attending.append("<span class='tooltiptxt'>Attending?</span>")
    form.append("<br/>");

    var infoId = "info-" + memberId;
    var guestInfo = $("<div class='rsvp-info' id='"+infoId+"'>").appendTo("#"+rsvpGuestId);
    guestInfo.append("<label for='meal'>Preferred Meal</label>");
    var meal = $("<select id='meal-"+memberId+"' name='meal' disabled>").appendTo("#"+infoId);
    meal.append($("<option>").attr("value", "").text("N/A"));
    meal.append($("<option>").attr("value", "fish").text("Fish"));
    meal.append($("<option>").attr("value", "chicken").text("Chicken"));
    meal.append($("<option>").attr("value", "vegetarian").text("Vegetarian"));
    guestInfo.append("<br/>");

    guestInfo.append("<label for='restrictions'>Dietary Restrictions</label>");
    guestInfo.append("<input id='restrictions-"+memberId+"' type='text' name='restrictions' disabled/>");
    guestInfo.append("<br/>");

    guestInfo.append("<label for='comments'>Comments</label>");
    guestInfo.append("<input id='comments-"+memberId+"' type='text' name='comments' disabled/>");
    guestInfo.append("<br/>");
    form.append("<br/>");
  })

  $parentForm.append("<button id='rsvp-button' type='submit'>Submit</button>");
}

function getGuestNames(guests) {
  var guestNames = [];
  guests.forEach((entry) => {
    guestNames.push(entry['name']);
  })
  return guestNames;
}

function findFamily(guests, familyId) {
  var family = [];
  guests.forEach((entry) => {
    if (entry['family_id'] === familyId) {
      family.push(entry['name']);
    }
  })
  return family;
}

function isAttending(checkbox) {
  var suffixId = checkbox.id.replace("attending", "");
  // console.log(suffixId);

  if (checkbox.checked) {
    document.getElementById("meal"+suffixId).disabled = false;
    document.getElementById("restrictions"+suffixId).disabled = false;
    document.getElementById("comments"+suffixId).disabled = false;
  } else {
    document.getElementById("meal"+suffixId).disabled = true;
    document.getElementById("restrictions"+suffixId).value = "";
    document.getElementById("restrictions"+suffixId).disabled = true;
    document.getElementById("comments"+suffixId).value = "";
    document.getElementById("comments"+suffixId).disabled = true;
  }
}

function convertFormDataToJson(formData) {
  formData = formData.split(/(?=&name)/g);
  var jsonData = [];
  formData.forEach((data) => {
    data = data.replace("&name", "name");
    data = new URLSearchParams(data);
    data = Object.fromEntries(data);
    jsonData.push(data);
  });

  return JSON.stringify(jsonData);
}

function hideRsvpTable() {
  var parentElement = $(".rsvp-guest").parent();
  parentElement.find(".rsvp-guest").remove();
  var buttonElement = $("#rsvp-button");
  buttonElement.remove();
  $(".search-result").hide();
  $(".search-container").hide();

  // var button = document.getElementById("search-button");
  // button.removeAttribute("disabled");
  // button.style.cursor = "pointer";
  // var searchText = document.getElementById("search-name");
  // searchText.removeAttribute("disabled");
  // searchText.value = "";
}

function sendRsvpData(jsonData) {
  document.getElementById("rsvp-submitted").style.display="block";
  $(".rsvp-submitted").html("Submitting information... Please do not close.");

  $.post("https://script.google.com/macros/s/AKfycbxRywU25AGPHo5biswA-_FNMOV74DxymKsebhuLfjbUJoHJ3mc4Mrv9gvA-76QtAAl-/exec", jsonData)
    .done(function (jsonData) {
      // console.log(jsonData);
      if (jsonData.result === "error") {
        $(".rsvp-submitted").html(jsonData.message);
        redirectTo("RSVP.html");
      } else {
        $(".rsvp-submitted").html("Success! Thank you!");
        redirectTo("DETAILS.html");
      }
    })
    .fail(function (jsonData) {
      // console.log(data);
      $(".rsvp-submitted").html("There was an issue with the server.");
      redirectTo("RSVP.html");
    });
}

function redirectTo(url) {
  window.setTimeout(function() {
    window.location.href = url;
  }, 2000);
}

$(document).ready(function(){
  $(".search-result").hide();
  var unparsed = $("#unparsed-guests").html();
  var guests = processData(unparsed);

  onSearchInput(guests);

  $("#search-form").submit(function(){
    var inputName = $("#search-name").val();
    var matchingGuest = findMatchingGuests(guests, inputName);

    if (matchingGuest === null || matchingGuest.length <= 0) {
      console.log("No result found.")
    } else if (matchingGuest.length > 1) {
      console.log("There is more than one matching result. Please be more specific.")
    } else {
      disableSearch();
      $(".search-result").fadeIn('slow');
      populateGuestsTable(guests, matchingGuest);
    }
  });

  $("#rsvp-form").on("submit", function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    // console.log(formData);
    var jsonData = convertFormDataToJson(formData);
    // console.log(jsonData);

    hideRsvpTable();
    sendRsvpData(jsonData);
  });
});
