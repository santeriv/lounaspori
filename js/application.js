/* 
	jQuery Mobile Boilerplate
	application.js
*/
$(document).on("pageinit", function(event) {
    // custom code goes here

    $.ajax({
        dataType: 'jsonp',
        url: "http://www.pulljson.com/jquery?site=www.jquery.com&selector=find('a img')&callback=?",
        success: function(data) {
            var items = [];
            /*Puts into list found linksimages' alt text from jquery.com site*/
            $.each(data.results, function(key, val) {
                /* val.text refers to content of tags */
                items.push('<li id="' + key + '"><img src="' + val.attributes.src + '"/>' + val.attributes.alt + '</li>');
            });

            $('#lazylist').append(items.join(''));
            /*refresh jqm lookandfeel for appended items*/
            $('#lazylist').listview('refresh');
        }
    });

});