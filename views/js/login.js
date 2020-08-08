$(document).on('submit', '#login_form', function(e) {
    var user_data = { 
        'username': $(this).find('input[name="username"]').val(), 
        'password': $(this).find('input[name="password"]').val()
    };
    $.ajax({
        url: '/login',
        method: 'post',
        dataType: 'json',
        data: user_data,
        success: (data) => {
            set_cookie('authorization', 'Bearer ' + data.token, 7);
            window.location.replace('/');
        }
    });
    return false;
});

function set_cookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function check_login_state() {
    FB.getLoginStatus(function(response) {
        console.log(response)
        if(response.authResponse) {
            FB.api('/me', function(response) {
                var profile_image_link = "http://graph.facebook.com/" + response.id + "/picture";
                var user_data = { 
                    'type': 'facebook',
                    'facebook_id': response.id,
                    'username': response.name, 
                    'image': profile_image_link
                };
                $.ajax({
                    url: '/login',
                    method: 'post',
                    dataType: 'json',
                    data: user_data,
                    success: (data) => {
                        set_cookie('facebook', data.token);
                        window.location.replace('/');
                    }
                });
            });
        } else {
            redirect_to_login();
        }
    });
}

// window.fbAsyncInit = function() {
//     FB.init({
//         appId: '986380245147835',
//         cookie: true,
//         xfbml: true,
//         version: 'v8.0'
//     });
//     FB.AppEvents.logPageView();
//     FB.getLoginStatus(function(response) {
//         if(response.authResponse) {

//         } else {
//             redirect_to_login();
//         }
//     });
// };
// (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));