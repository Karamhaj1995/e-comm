function load_categories() {
    $.ajax({
        url: '/api/categories/',
        method: 'GET',
        success: data => {
            $("#new_product_form input[name='category']").autocomplete({
                source: data.map(category => {  return category.name })
            });
        },
        error: xhr => {

        }
    });
}