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

function set_cookie(cookie_name,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cookie_name + "=" + cvalue + ";" + expires + ";path=/";
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
