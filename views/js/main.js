$(document).ready(() => {

    window.fbAsyncInit = function() {
        FB.init({
            appId: '986380245147835',
            cookie: true,
            xfbml: true,
            version: 'v8.0'
        });
        FB.AppEvents.logPageView();
        FB.getLoginStatus(function(response) {
            if(response.authResponse) {
                console.log('here')
            } else {
                redirect_to_login();
            }
        });
    };
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    var $navigation_bar = $('.navigation_bar');
    var $pages = $('.navigation_bar .page, .navigation_bar .header');
    

    $navigation_bar.on('click', e => {
        if($navigation_bar.hasClass('reset')) {
            $navigation_bar.removeClass('reset');
            return;
        }
        // !$navigation_bar.hasClass('open') && $navigation_bar.addClass('open');
        if($navigation_bar.hasClass('open')) {
            var $target = $(e.target);
            if($target.hasClass('page') || $target.closest('.page').length) {
                return;
            }
        }
        $pages.tooltip('hide');
        $navigation_bar.toggleClass('open');
    });

    $pages.on('click', e => {
        if($navigation_bar.hasClass('open')) {
            var $page = $(e.currentTarget);
            reset_navigation_bar();
            stop_loading_pages();
            animate_load_page($page);
            load_page_content($page);
        }
    });

    function reset_navigation_bar() {
        $navigation_bar.removeClass('open').addClass('reset');
        $pages.removeClass('loading');
    }

    function animate_load_page($page) {
        var page_name = $page.attr('name');
        var $icon = $page.find('i');
        var old_classes = $icon.attr('class');
        $icon.attr('old-class', old_classes);
        $page.addClass('loading');
        $page.attr({
            'data-toggle': 'tooltip',
            'data-placement': 'right',
            'title': page_name
        });
        $icon.removeClass(old_classes);
        $icon.addClass('fa fa-spin fa-spinner');
        setTimeout(e => { $page.tooltip('show') }, 400);
    }

    function load_page_content($page) {
        var page_name = $page.attr('name');
        $.ajax({
            'url': '/api/' + page_name + '/',
            'method': 'get',
            'success': function(data) {
                stop_loading_pages();
                setTimeout(e => { 
                    $page.tooltip('hide');
                    $page.addClass('active');
                }, 400);
                if(page_name == 'products') {
                    build_products_page(data);
                } else if(page_name == 'deals') {
                    build_deals_page(data);
                }
            }
        });
    }

    function stop_loading_pages() {
        $pages.find('i.fa-spinner').each((index, icon) => {
            var $icon = $(icon);
            $icon.removeClass('fa fa-spin fa-spinner');
            $icon.addClass($icon.attr('old-class'));
        });
        $pages.removeClass('loading')
    }

    function redirect_to_login() {
        deleteAllCookies();
        window.location = '/login'
    }

    function deleteAllCookies(){
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            set_cookie(cookies[i].split("=")[0], "", -1);
        }
    }

    function set_cookie(name, value, expirydays) {
        var d = new Date();
        d.setTime(d.getTime() + (expirydays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    }

});