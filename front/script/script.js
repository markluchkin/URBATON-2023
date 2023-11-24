$(document).ready(function () {
  var panelOne = $(".form-panel.two").height() + 100,
    panelTwo = $(".form-panel.two")[0].scrollHeight;

  $(".form-panel.two")
    .not(".form-panel.two.active")
    .on("click", function (e) {
      e.preventDefault();

      $(".form-toggle").addClass("visible");
      $(".form-panel.one").addClass("hidden");
      $(".form-panel.two").addClass("active");
      $(".form").animate(
        {
          height: panelTwo,
        },
        200
      );
    });

  $(".form-toggle").on("click", function (e) {
    e.preventDefault();
    $(this).removeClass("visible");
    $(".form-panel.one").removeClass("hidden");
    $(".form-panel.two").removeClass("active");
    $(".form").animate(
      {
        height: panelOne,
      },
      200
    );
  });
  function sendRequest(url, method, data, successCallback, errorCallback) {
    $.ajax({
      url: url,
      method: method,
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      success: successCallback,
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status >= 400) {
          errorCallback(jqXHR.responseText);
        }
      },
    });
  }

  $("#login").on("click", function (e) {
    e.preventDefault();

    var loginData = {
      email: $("#email").val(),
      password: $("#password").val(),
    };

    sendRequest(
      "http://192.168.147.148:3000/api/leader/login",
      "POST",
      loginData,
      function (data, textStatus, jqXHR) {
        console.log("Login success:", data);
      },
      function (errorResponse) {
        $("#error-login").text(JSON.parse(errorResponse).message);
      }
    );
  });

  $("#signup").on("click", function (e) {
    e.preventDefault();

    var signupData = {
      email: $("#email-sign").val(),
      name: $("#username").val(),
      phone: $("#phone-sign").val(),
    };

    sendRequest(
      "http://192.168.147.148:3000/api/leader/signup",
      "POST",
      signupData,
      function (data, textStatus, jqXHR) {
        console.log("Signup success:", data);
      },
      function (errorResponse) {
        $("#error-signup").text(JSON.parse(errorResponse).message);
      }
    );
  });
});
