/* jQuery Listex
   
   For jQuery 1.7+

   By James Waples
      http://www.jamwaffles.co.uk/jquery/listex
*/

(function($) {
	$.fn.listex = function(options) {
		var settings = $.extend({
			animate: true,
			animationSpeed: 200,
			watch: true,
			watchInterval: 500
		}, options);

		var originalContent;

		var listexMarkup = $('<div class="listexContainer">\
								<div class="listexBox">\
									<span class="listexText"></span>\
									<span class="listexArrow"></span>\
								</div>\
								<ul class="listexList"></ul>\
							</div>');
		
		// Polling
		var refresh = function() {
			var selects = $('select.listexWatch');
			var newContent = selects.html();

			// If content has changed
			if(selects.length && newContent != originalContent) {
				originalContent = newContent;		// Update original content

				selects.each(function() {
					var select = $(this);

					var container = select.next('div.listexContainer');
					var box = container.find('div.listexBox');
					var text = box.find('span.listexText');
					var arrow = box.find('span.listexArrow');
					var options = container.find('ul.listexListexList');

					// Set various styles
					options.css({ width: box.outerWidth(true) - parseInt(box.css('border-left-width')) - parseInt(box.css('border-right-width')) });		// Set correct list width

					// Set text and options
					if(select.find('option:selected').length) {
						text.text(select.find('option:selected').text());
					} else {
						text.text(select.find('option').first().text());
					}

					// Get options from `<select>` and add to list box
					options.find('li').remove();

					select.find('option').each(function() {
						if($(this).attr('disabled')) {
							options.append('<li class="disabled" data-value=' + $(this).attr('value') + '>\
								' + $(this).text() + '\
							</li>');
						} else {
							options.append('<li data-value=' + $(this).attr('value') + '>\
								' + $(this).text() + '\
							</li>');
						}
					});
				});
			}
			
			setTimeout(refresh, settings.watchInterval);
		}

		// If we want to watch our selects, start the `setInterval()` ball rolling with refresh()
		if(settings.watch) {
			refresh();	
		}

		$('html').on('click', function(e) {
			if(settings.animate) {
				$('listexContainer ul.listexList').slideUp(settings.animationSpeed);
			} else {
				$('listexContainer ul.listexList').hide();
			}

			$('div.listexContainer').removeClass('open');
		});

		return this.each(function() {
			var select = $(this);

			select.after(listexMarkup.clone()).hide();		// Add markup after `<select>`

			var container = select.next('div.listexContainer');
			var box = container.find('div.listexBox');
			var text = box.find('span.listexText');
			var arrow = box.find('span.listexArrow');
			var options = container.find('ul.listexList');
			
			// Add identifier class to original select
			select.addClass('listex');

			// If we're watching this select
			if(settings.watch) {
				// Add this `<select>`s HTML to the `originalContent` variable for comparison in watch()
				originalContent += select.html();

				// Add `watch` class
				select.addClass('watch');
			}

			// Set various styles
			options.css({ width: box.outerWidth(true) - parseInt(box.css('border-left-width')) - parseInt(box.css('border-right-width')) });		// Set correct list width


			// Set text and options
			if(select.find('option:selected').length) {
				text.text(select.find('option:selected').text());
			} else {
				text.text(select.find('option').first().text());
			}

			// Get options from `<select>` and add to list box
			select.find('option').each(function() {
				if($(this).attr('disabled')) {
					options.append('<li class="disabled" data-value=' + $(this).attr('value') + '>\
						' + $(this).text() + '\
					</li>');
				} else {
					options.append('<li data-value=' + $(this).attr('value') + '>\
						' + $(this).text() + '\
					</li>');
				}
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
				
				if(!$(this).hasClass('disabled')) {
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

					// Select box modification and events
					if(select.val() != $(this).data('value')) {
						select.val($(this).data('value')).change();
					}
				}
			});

			select.on('change', function() {
				options.find('li[data-value="' + $(this).attr('value') + '"]').click();
			});
		});
	};
})(jQuery);