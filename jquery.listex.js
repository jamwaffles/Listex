/* jQuery Listex
   
   For jQuery 1.7+

   By James Waples
      http://www.jamwaffles.co.uk/jquery/listex
      Bugs fixed and some other changes made by exside on 14.04.2013
*/

(function($) {
	$.fn.listex = function(options) {
		var settings = $.extend({
			animate: true,
			animationSpeed: 200,
			watch: true,
			watchInterval: 5000,
			classIdentifier: 'listex',
			classContainer: 'listexContainer',
			classBox: 'listexBox',
			classBoxText: 'listexText',
			classList: 'listexList',
			classWatch: 'watch',
			classOpen: 'open'
		}, options);

		var originalContent = '';

		var listexMarkup = $('<div class="' + settings.classContainer + '">\
								<div class="' + settings.classBox + '">\
									<span class="' + settings.classBoxText + '"></span>\
								</div>\
								<ul class="' + settings.classList + '"></ul>\
							</div>');

		// Polling
		var refresh = function() {
			var selects = $('select.' + settings.classWatch);
			var newContent = '';

			selects.each(function() {
				newContent += $(this).html();
			});
			//console.log('original' + originalContent);
			//console.log('newly checked' + newContent);

			// If content has changed
			if ( selects.length && newContent != originalContent ) {
				originalContent = newContent;		// Update original content
				console.log('content changed');

				selects.each(function() {
					var select = $(this);

					var container = select.next('div.' + settings.classContainer);
					var box = container.find('div.' + settings.classBox);
					var text = box.find('span.' + settings.classBoxText);
					//var arrow = box.find('span.listexArrow'); unused...replaced through :after element instead of adding a real element
					var options = container.find('ul.' + settings.classList);

					// Set various styles
					// exside, commeted out, set via css
					//options.css({ width: box.outerWidth(true) - parseInt(box.css('border-left-width')) - parseInt(box.css('border-right-width')) });		// Set correct list width

					// Set text and options
					if ( select.find('option:selected').length ) {
						text.text(select.find('option:selected').text());
					} else {
						text.text(select.find('option').first().text());
					}

					// Get options from `<select>` and add to list box
					options.find('li').remove();

					select.find('option').each(function() {
						if ( $(this).attr('disabled') ) {
							options.append('<li class="disabled" data-value=' + $(this).attr('value') + '>' + $(this).text() + '</li>');
						} else {
							options.append('<li data-value=' + $(this).attr('value') + '>' + $(this).text() + '</li>');
						}
					});
				});
			} else {
				console.log('no options had any changes since the last check');
			}
			setTimeout(refresh, settings.watchInterval);
		};

		// If we want to watch our selects, start the `setInterval()` ball rolling with refresh()
		if ( settings.watch ) {
			refresh();
		}

		// Hide the dropdown when clicking somewhere else in the page
		$('html').on('click', function(e) {
			if ( settings.animate ) {
				$('ul.' + settings.classList, 'div.' + settings.classContainer).fadeOut(settings.animationSpeed);
			} else {
				$('ul.' + settings.classList, 'div.' + settings.classContainer).hide();
			}

			$('div.' + settings.classContainer).removeClass('open');
		});

		return this.each(function() {
			var select = $(this);

			select.after(listexMarkup.clone()).hide();		// Add markup after `<select>`

			var container = select.next('div.' + settings.classContainer);
			var box = container.find('div.' + settings.classBox);
			var text = box.find('span.' + settings.classBoxText);
			//var arrow = box.find('span.listexArrow');
			var options = container.find('ul.' + settings.classList);

			// Add identifier class to original select
			// select.addClass(classIdentifier); // not sure what this is used for, can't find it anywhere

			// If we're watching this select
			if ( settings.watch ) {
				// Add this `<select>`s HTML to the `originalContent` variable for comparison in watch()
				originalContent += select.html();

				// Add `watch` class
				select.addClass(settings.classWatch);
			}

			// Set various styles
			// exside, commented out, set via css, small layout inconsistencies when using box-sizing: border-box;
			//container.width = select.outerWidth();
			//options.css({ width: box.outerWidth(true) - parseInt(box.css('border-left-width')) - parseInt(box.css('border-right-width')) });		// Set correct list width


			// Set text and options
			if ( select.find('option:selected').length ) {
				text.text(select.find('option:selected').text());
			} else {
				text.text(select.find('option').first().text());
			}

			// Get options from `<select>` and add to list box
			select.find('option').each(function() {
				if ( $(this).attr('disabled') ) {
					options.append('<li class="disabled" data-value=' + $(this).attr('value') + '>' + $(this).text() + '</li>');
				} else {
					options.append('<li data-value=' + $(this).attr('value') + '>' + $(this).text() + '</li>');
				}
			});

			/* Events */
			box.on('click', function(e) {

				e.stopPropagation();

				container.toggleClass(settings.classOpen);

				// Hide any other open selects
				if ( settings.animate ) {
					$('div.' + settings.classContainer + '.' + settings.classOpen).not(container).removeClass(settings.classOpen).find('ul').fadeOut(settings.animationSpeed);
				} else {
					$('div.' + settings.classContainer + '.' + settings.classOpen).removeClass(settings.classOpen).find('ul').hide();
				}

				// exside, commented out, set by css
				//options.css({ width: box.outerWidth(true) - parseInt(box.css('border-left-width')) - parseInt(box.css('border-right-width')) });		// Set correct list width

				if ( settings.animate ) {
					options.stop(true, true).fadeToggle(settings.animationSpeed);
				} else {
					options.stop(true, true).toggle();
				}

				/*if(options.is(':visible')) {
					$(this).parent().addClass('open');
				} else {
					$(this).parent().removeClass('open');
				}*/
			});

			options.on('click', 'li', function(e) {
				e.stopPropagation();

				if ( !$(this).hasClass('disabled') ) {
					$(this).addClass('selected').siblings().removeClass('selected');
					container.removeClass(settings.classOpen);

					// Set box's text to this `<li>`s text
					text.text($(this).text());

					// Slide list up
					if ( settings.animate ) {
						$(this).parent().fadeOut(settings.animationSpeed);
					} else {
						$(this).parent().hide();
					}

					// Select box modification and events
					if ( select.val() != $(this).data('value') ) {
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
