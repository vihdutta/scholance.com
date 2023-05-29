const quotes = [
  "'I can't believe how easily I can help others from my laptop.' - T.G.",
  "'Online community service is the future. Proud to join it!' - C.H.",
  "'I never thought I could make such a big difference online.' - A.M.",
  "'Online volunteering is perfect for students like me.' - E.L.",
  "'There's so much to gain from this, and nothing to lose.' - B.N.",
  "'My community service hours will be much easier to earn.' - W.E.",
  "'Doing the school's requirements from home is awesome.' - H.J.",
  "'Just wow. Do you know how much I need this right now?' - G.S.",
  "'This is the most helpful thing I've found in a while.' - J.W.",
  "'I'm gonna need this. I'm so glad I can use it now.' - Y.L.",
  "'It's so simple to sign up and use. Really incredible.' - G.J.",
  "'This is a lifesaver. No joke, it's so helpful to me.' - M.P."
];

// Initialize the quote index to 0
var quoteIndex = 0;

// Function to change the quote
function changeQuote() {
  // Fade out the current quote
  $("#quotes").fadeOut(500, function () {
    // Get the current quote from the array
    var currentQuote = quotes[quoteIndex];
    // Update the text of the quote element
    $(this).text(currentQuote);
    // Increment the quote index
    quoteIndex++;
    // If we've reached the end of the array, start over
    if (quoteIndex >= quotes.length) {
      quoteIndex = 0;
    }
    // Fade in the new quote
    $(this).fadeIn(500);
  });
}

// Call the function to change the quote initially after the document has loaded
$(document).ready(function () {
  changeQuote();
  // Change the quote automatically every 2.5 seconds
  setInterval(changeQuote, 3000);
});

$(document).ready(function () {
  // When the button with id "scroll" is clicked
  $('#scroll').click(function () {
    // Animate scrolling to the top of the page
    var inputBox = $("#main-email");
    inputBox.focus();
    $('html, body').animate({ scrollTop: 0 }, 'fast');

    // Return false to prevent default behavior of the button
    return false;
  });
});

// Function to make the AJAX request for requesting early access
function requestEarlyAccess(email) {
  $.ajax({
    type: "GET",
    url: "/api/request-early-access/" + email,
    success: function(data) {
      console.log("Request early access request successful!");
      console.log("Status: " + data.status);
    },
    error: function() {
      console.log("Request early access request failed.");
    }
  });
}
// Trigger the request early access request when the request early access form is submitted
$("#request-early-access").on("submit", function(e) {
  e.preventDefault();
  var extra = $(this).find("#extra").val();
  if (extra !== "") {
    console.log("Extra field is not empty. Ignoring early access request.");
    return;
  }
  var email = $(this).find("#main-email").val();
  $(this).find("#main-email").val("Thank you! We'll send access through your email soon!");
  requestEarlyAccess(email);
});
