(function($) {
	$.fn.listex = function(options) { 
		var settings = $.extend({
			animate: true,
			animationSpeed: 200
		}, options);

		var listexMarkup = $('<div class="listex container">\
								<div class="box">\
									<span class="text"></span>\
									<span class="arrow"></span>\
								</div>\
								<ul class="list"></ul>\
							</div>');

		$('html').on('click', function() {
			if(settings.animate) {
				$('div.listex ul.list').slideUp(settings.animationSpeed);
			} else {
				$('div.listex ul.list').hide();
			}
			
			$('div.listex.container').removeClass('open');
		});

		return this.each(function() {        
			var select = $(this);
			
			select.after(listexMarkup);		// Add markup after `<select>`

			var container = select.next('div.listex.container');
			var box = container.find('div.box');
			var text = box.find('span.text');
			var arrow = box.find('span.arrow');
			var options = container.find('ul.list');

			/* Set text and options */
			if(select.find('option:selected').length) {
				text.text(select.find('option:selected').text());
			} else {
				text.text(select.find('option').first().text());
			}
			
			select.find('option').each(function() {
				options.append('<li data-value=' + $(this).attr('value') + '>\
					' + $(this).text() + '\
				</li>');
			});

			/* Events */
			box.on('click', function(e) {
				e.stopPropagation();

				container.toggleClass('open');

				if(settings.animate) {
					options.stop(true, true).slideToggle(settings.animationSpeed);
				} else {
					options.stop(true, true).toggle();
				}
			});

			options.on('click', 'li', function(e) {
				e.stopPropagation();
				
				$(this).addClass('selected').siblings().removeClass('selected');
				container.removeClass('open');

				// Set box's text to this `<li>`s text
				text.text($(this).text());

				// Slide list up
				if(settings.animate) {
					$(this).parent().slideUp(settings.animationSpeed);
				} else {
					$(this).parent().hide();
				}
			});
		});
	};
})(jQuery);