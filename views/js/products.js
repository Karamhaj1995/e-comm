$(document).on('submit', '#new_product_form', function(e) {
    var product_data = { 
        'name': $(this).find('input[name="name"]').val(), 
        'price': $(this).find('input[name="price"]').val(), 
        'details': $(this).find('input[name="details"]').val(),
        'category': $(this).find('input[name="category"]').val(),
        'image': 'image'
    };
    $.ajax({
        url: '/api/products/',
        method: 'post',
        dataType: 'json',
        data: product_data,
        success: (product) => {
            $('#new_product_form')[0].reset();
            $('.app .content .products_list').prepend(generate_product_item(product));
            $add_product.click();
        }
    });
    return false;
});

var $new_product_form = `
    <div class="new_product_dialog">
        <form id="new_product_form">
            <input type="text" name="name" placeholder="Product Name" required="true" />
            <input type="number" name="price" placeholder="Unit price" required="true" />
            <input type="text" name="category" placeholder="Category" required="true" />
            <label>Add New Category</label>
            <input type="text" name="details" placeholder="Details" required="true" />
            <input type="submit" value="Publish" />
        </form>
    </div>`;

function build_products_page(products) {
    $('.app .content .header').html('<p>Products Page</p><i class="add_product fa fa-plus"></i>');
    $add_product = $('.add_product');
    $add_product.on('click', e => {
        $add_product.toggleClass('cancel')
        $('.new_product_dialog').toggle('show');
    });
    $('.new_product_dialog, .products_list').remove();
    $('.app .content').append($new_product_form);
    load_categories();
    $('.app .content').append('<div class="products_list"></div>');
    products.forEach(product => {
        $('.app .content .products_list').prepend(generate_product_item(product));
    });
}

function generate_product_item(product) {
    return `
        <div class="product_item">
            <img src="../images/test-item.jpg" />
            <div class="details">
                <p class="product_title">${ product.name }</p>
                <p class="product_price">${ product.price }$</p>
            </div>
        </div>
    `;
}