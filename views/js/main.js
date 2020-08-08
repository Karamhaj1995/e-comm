$(document).ready(() => {

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

    function build_products_page(products) {
        $('.app .content .header').html('<p>Products Page</p><i class="fa fa-plus"></i>');
        $('.products_list').remove();
        $('.app .content').append('<div class="products_list"></div>');
        products.forEach(product => {
            $('.app .content .products_list').append(`
                <div class="product_item">
                    <img src="../images/test-item.jpg" />
                    <p class="product_title">some title user</p>
                </div>
            `);
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

});