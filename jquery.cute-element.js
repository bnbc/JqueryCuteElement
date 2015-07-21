(function($) {
    $.fn.cuteElement = function(options)
    {
       var defauts = {
           "labelPosition": "next",
           "theme": "checkbox",
           "selectWidth": "auto",
       };

       var params = $.extend(defauts, options);

        return this.each(function()
        {
            var element = $(this);
            var tag = element.prop('tagName').toLowerCase();

            switch(tag){
                case 'select':

                    var selected_option = element.find('option:selected');
                    var icon = selected_option.data('icon');

                    /* Largeur du select */
                    var select_width = params.selectWidth;
                    if(element.data('width')){
                        select_width = element.data('width');
                    }

                    var selected_option_text = selected_option.text() != '' ? selected_option.text() : '&nbsp;';
                    var a = $('<a href="#" class="cute-element-select cute-element-select-theme-' + params.theme + '">' + selected_option_text + '</a>').css('width', select_width);
                    if(icon){
                        a.css({
                            'background-image': 'url("' + icon + '")'
                        });
                        a.addClass('cute-element-select-icon');
                    }

                    var ul = $('<ul class="cute-element-select-option"></ul>');
                    element.find('option').each(function(){
                        var icon = $(this).data('icon');
                        var text = $(this).text() != '' ? $(this).text() : '&nbsp;';
                        var a = $('<a href="#" data-value="' + $(this).attr('value') + '">' + text + '</a>');
                        var li = $('<li></li>');
                        li.append(a);
                        ul.append(li);
                        if(icon){
                            a.css({
                                'background-image': 'url("' + icon + '")'
                            });
                            a.addClass('cute-element-select-option-icon');
                            a.data('icon', icon);
                        }
                    });

                    element.after(a);
                    $('body').append(ul);

                    /* Taille minimum de la liste */
                    var max_width = 0;
                    ul.find('a').each(function(){
                        if(max_width < a.width())
                            max_width = a.width();
                    });

                    var padding = a.outerWidth() - a.width();

                    ul.css({
                        'min-width': max_width + padding
                    });

                    element.hide();

                    /** CLic sur les options **/
                    ul.find('a').click(function(event){
                        event.preventDefault();
                        ul.find('a').removeClass('selected');
                        $(this).addClass('selected');
                        element.find('option').prop('selected', false).attr('selected', false);
                        element.find('option[value="' + $(this).data('value') + '"]').prop('selected', true).attr('selected', true);
                        a.text($(this).text());
                        var icon = $(this).data('icon');
                        if(icon){
                            a.css({
                                'background-image': 'url("' + icon + '")'
                            });
                            a.addClass('cute-element-select-icon');
                        }
                        ul.toggleClass('cute-element-select-option-open');
                        a.toggleClass('cute-element-select-open');
                        element.trigger('change');
                    });

                    a.click(function(event){
                        event.preventDefault();
                        var top = $(this).offset().top + $(this).outerHeight();
                        var left = $(this).offset().left;
                        ul.css({'top': top + 'px', 'left': left + 'px'});
                        ul.toggleClass('cute-element-select-option-open');
                        $(this).toggleClass('cute-element-select-open');
                    });
                break;
                case 'input':
                    var type = element.attr('type');
                    var a = $('<a href="#" class="cute-element-' + type + ' cute-element-input-theme-' + params.theme + '"></a>');

                    if(params.labelPosition == 'next')
                        var label = element.next('label');
                    else
                        var label = element.prev('label');

                    if(label.length)
                        label.addClass('cute-element-input-label');

                    element.after(a);
                    element.hide();

                    if(element.is(':checked')){
                        a.addClass('checked');
                        label.addClass('checked');
                    }

                    if(element.prop('disabled')){
                        a.addClass('disabled');
                        a.click(function(event){
                            event.preventDefault();
                        });
                        label.addClass('disabled');
                    }
                    else {
                        a.click(function(event){
                            event.preventDefault();
                            switch(type){
                                case 'checkbox':
                                    if($(this).is(':checked'))
                                        element.prop('checked', false).attr('checked', false);
                                    else
                                        element.prop('checked', true).attr('checked', true);
                                    $(this).toggleClass('checked');
                                break;
                                case 'radio':
                                    var name = element.attr('name');
                                    $('input[type="radio"][name="' + name + '"]').prop('checked', false).attr('checked', false).each(function(){
                                        $(this).next('a.cute-element-radio').removeClass('checked');
                                    });
                                    element.prop('checked', true).attr('checked', true);
                                    $(this).addClass('checked');
                                break;
                            }
                        });
                        if(label.length)
                            label.click(function(){
                                a.trigger('click');
                            });
                    }

                break;
            }
        });
    };
})(jQuery);