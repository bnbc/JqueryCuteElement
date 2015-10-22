;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "cuteElement",
        defaults = {
            labelPosition: 'next',
            theme: 'checkbox',
            selectWidth: 'auto',
            inputContainer: null,
            showElement: false,
            onClick: $.noop,
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin

        // Si options est une string alors on lance la fonction correspondante
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            var self = this;
            var $elt = $(this.element);
            var tag  = $elt.prop('tagName').toLowerCase();

            switch(tag){
                case 'select':
                    var selected_option = $elt.find('option:selected');
                    var icon = selected_option.data('icon');

                    // Largeur du select
                    var select_width = self.options.selectWidth;
                    if($elt.data('width')){
                        select_width = $elt.data('width');
                    }

                    // Construction de l'élément de substitution
                    var selected_option_text = selected_option.text() != '' ? selected_option.text() : '&nbsp;';
                    var a = $('<a href="#" class="cute-element-select cute-element-select-theme-' + self.options.theme + '">' + selected_option_text + '</a>').css('width', select_width);
                    if(icon){
                        a.css({
                            'background-image': 'url("' + icon + '")'
                        });
                        a.addClass('cute-element-select-icon');
                    }

                    // Construction de la liste déroulante
                    var ul = $('<ul class="cute-element-select-option"></ul>');
                    $elt.find('option').each(function(){
                        var icon     = $(this).data('icon');
                        var text     = $(this).text() != '' ? $(this).text() : '&nbsp;';
                        var disabled = $(this).prop('disabled');
                        var a        = $('<a href="#" data-value="' + $(this).attr('value') + '">' + text + '</a>');
                        var li       = $('<li></li>');
                        li.append(a);
                        ul.append(li);
                        if(icon){
                            a.css({
                                'background-image': 'url("' + icon + '")'
                            });
                            a.addClass('cute-element-select-option-icon');
                            a.data('icon', icon);
                        }
                        if(disabled){
                            a.addClass('cute-element-select-option-disabled');
                        }
                    });
                    $elt.after(a);
                    $('body').append(ul);

                    // Taille minimum de la liste
                    var max_width = 0;
                    ul.find('a').each(function(){
                        if(max_width < a.width())
                            max_width = a.width();
                    });
                    var padding = a.outerWidth() - a.width();
                    ul.css({
                        'min-width': max_width + padding
                    });
                    if(!self.options.showElement)
                        $elt.hide();

                    // Evénement click sur les options
                    ul.find('a').on('click', function(event){
                        event.preventDefault();
                        if(!$(this).hasClass('cute-element-select-option-disabled')){
                            ul.find('a').removeClass('selected');
                            $(this).addClass('selected');

                            // On met le selected sur l'option correspondante
                            if($(this).attr('data-value') === undefined){
                                alert("No value on option");
                            }
                            $elt.find('option').prop('selected', false).attr('selected', false);
                            $elt.find('option[value="' + $(this).attr('data-value') + '"]').prop('selected', true).attr('selected', true);
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

                            // On déclence l'événement change
                            $elt.trigger('change');
                        }
                    });

                    // Fermeture quand on quitte la liste déroulante
                    ul.on('mouseleave', function(){
                        a.removeClass('cute-element-select-open');
                        $(this).removeClass('cute-element-select-option-open')
                    });

                    // Evénement click
                    a.on('click', function(event){
                        event.preventDefault();
                        var retrn = true;
                        if(self.options.onClick !== $.noop){
                            retrn = self.options.onClick(event, $elt);
                        }
                        if(retrn !== false){
                            var top = $(this).offset().top + $(this).outerHeight();
                            var left = $(this).offset().left;
                            ul.css({'top': top + 'px', 'left': left + 'px'});
                            ul.toggleClass('cute-element-select-option-open');
                            $(this).toggleClass('cute-element-select-open');
                        }
                    });
                break;
                case 'input':
                    // Type de l'élément : radio ou checkbox
                    var type = $elt.attr('type');
                    var guid = guid();
                    $elt.attr('data-guid', guid);

                    // Position du label par rapport à l'input
                    var label = $elt.next('label');
                    if(self.options.labelPosition == 'prev'){
                        label = $elt.prev('label');
                    }

                    // Infos sur le label
                    if(label.length){
                        label.addClass('cute-element-input-label');
                        label.attr('data-guid', guid);
                    }

                    // Si la paramètre est spécifié on créé un container
                    var container = null;
                    if(self.options.inputContainer !== null){
                        container = $(self.options.inputContainer);
                        $elt.after(container);
                        container.append($elt);
                        container.addClass('cute-element-input-container cute-element-' + type + '-container-' + self.options.theme);
                        if(self.options.labelPosition == 'next'){
                            container.append(label);
                        }
                        else {
                            container.prepend(label);
                        }
                        container.attr('data-guid', guid);
                    }

                    // Construction de l'élément de substitution
                    var clone = $('<a href="#" class="cute-element-' + type + ' cute-element-input-theme-' + self.options.theme + '"></a>');
                    $elt.after(clone);
                    clone.attr('data-guid', guid);
                    if(!self.options.showElement)
                        $elt.hide();

                    // Si l'élement est coché
                    if($elt.is(':checked')){
                        clone.addClass('checked');
                        label.addClass('checked');
                        if(container !== null){
                            container.addClass('checked');
                        }
                    }

                    // Si l'élément est désactivé
                    if($elt.prop('disabled')){
                        clone.addClass('disabled');
                        clone.click(function(event){
                            event.preventDefault();
                        });
                        label.addClass('disabled');
                        if(container !== null){
                            container.addClass('disabled');
                        }
                    }
                    else {

                        var clickFunction = function(event){
                            event.preventDefault();
                            // Fonction sur l'événement click
                            var result = true;
                            if(self.options.onClick !== $.noop){
                                result = self.options.onClick(event, $elt);
                            }
                            // Si la fonction sur l'événement click retourne false on annnule le cochage
                            if(result !== false){
                                self.toggleCheck(self.element, self.options);
                            }
                        }

                        // Si il y a un container on déclenche l'évènement click
                        if(container.length){
                            container.on('click', function(event){
                                clickFunction(event);
                            });
                        }
                        else {
                            // Evénement click sur le substitut
                            clone.on('click', function(event){
                                clickFunction(event);
                            });

                            // Si il y a un label on déclenche l'évènement click sur celui-ci aussi
                            if(label.length){
                                label.on('click', function(event){
                                    clickFunction(event);
                                });
                            }
                        }
                    }
                break;
            }
        },

        toggleCheck: function(element, options){
            var element   = $(element);
            var guid      = element.attr('data-guid');
            var type      = element.attr('type');
            var container = $('.cute-element-input-container[data-guid="' + guid + '"]');
            var clone     = $('.cute-element-' + type + '[data-guid="' + guid + '"]');
            var checked   = element.is(":checked");
            switch(type){
                case 'checkbox':
                    element.prop('checked', !checked).attr('checked', !checked);
                    clone.toggleClass('checked');
                    if(container !== null)
                        container.toggleClass('checked');
                break;
                case 'radio':
                    var name = element.attr('name');
                    $('input[type="' + type + '"][name="' + name + '"]').prop('checked', false).attr('checked', false).each(function(){
                        var rguid      = $(this).attr('data-guid');
                        var rclone     = $('.cute-element-' + type + '[data-guid="' + rguid + '"]');
                        var rcontainer = $('.cute-element-input-container[data-guid="' + rguid + '"]');
                        rclone.removeClass('checked');
                        if(rcontainer !== null)
                            rcontainer.removeClass('checked');
                    });
                    element.prop('checked', true).attr('checked', true);
                    clone.addClass('checked');
                    if(container !== null)
                        container.addClass('checked');
                break;
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName,
                new Plugin( this, options ));
            }
            else {
                if(options == 'toggleCheck'){
                   $(this).data(pluginName).toggleCheck(this, options);
                }
            }
        });
    };

})( jQuery, window, document );