
function settings() {

  //the idea here is to login to Spark cloud, grab an access token, save it and use it to get devices

  //login form

  sparkLogin(function(data) {
    //return token and store globally in window
    window.token = data["access_token"];
    console.log(token);
  });

}

function tokenPlease() {
  spark.login({accessToken: window.token});

  var devicesPr = spark.listDevices();

    devicesPr.then(
      function(devices){
        console.log('Devices: ', devices);
        console.log('Name: ', devices[0]["name"]);
        console.log('ID: ', devices[0]["id"]);
        console.log('Connected: ', devices[0]["connected"]);
      },
      function(err) {
        console.log('List devices call failed: ', err);
      }
    );
}

function saveToken() {
  $.ajax({
    type: 'POST',
    url: '/savetoken',
    data: { token: window.token },
    success: function() {
      console.log(token);
    }
  })
}


function getToken() {
  $.ajax({
    type: 'get',
    url: '/gettoken',
    success: function (data) {
        //console.log(data);
    }
  })
}