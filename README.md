# jQuery Listex Plugin

Listex (List EXtended) is a small, lightweight **imageless** select box replacement plugin. It's designed to be as easy to use as possible, so only needs a small amount of CSS in addition to the plugin file.

## Compatability

This plugin works in all modern browsers.

## Features

- Imageless; Listex (including the arrow) is styled completely with CSS.
- Light. It's small and tries to be as unobtrusive as possible.
- Compatible: you don't need to call events on the Listex control - Listex watches the original `<select>` for events and changes such as:
	- Changes in `disabled` state for each `<option>`.
	- Changes in an `<option>`'s text.
	- Changes in an `<option>`'s value.

## Usage

- Copy `jquery.listex.js` to your JS libs folder.
- Add style rules for the select box to your stylesheet.
- Include it in your script _after_ `jquery.js`.
- Apply it to your select boxes with `$('select.foo').listex();`
	- Your selector can be whatever you like, but Listex will only apply itself to `<select>` tags.

## Options

Below are listed the options along with defaults for Listex, along with an explanation of what each option does.

`animate: true`
:	Defines whether the dropdown list should slide up/down, or appear/disappear.

`animationSpeed: 200`
:	How fast the dropdown list should slide open and closed, providing `animate` is set to `true`.

`watch: true`
:	Setting `watch` to `true` (default) will tell Listex to watch the original `<select>` it was called on for changes in it's content so it can update the replacement markup.

`watchInterval: 500`
:	Specifies how long Listex should wait before polling the `<select>` for changes. If you have a lot of `<select>` tags on a page, this should be set to `2000ms` or so.

## Styling

The markup added by Listex is something like the following:

	<div class="listexContainer open">
		<div class="listexBox">
			<span class="listexText">Foo</span>
		</div>

		<ul class="listexList" style="width: 148px; display: block;">
			<li data-value="Choose...">Choose...</li>

			<li data-value="foo">Foo</li>

			<li data-value="baz" class="disabled">Disabled option</li>

			<li data-value="bar">Bar</li>
		</ul>
	</div>

The CSS for the demo theme can be found on [Github](https://github.com/jamwaffles/Listex/blob/master/example/example.css), but is pretty self explanatory.

When the dropdown list is open, the `open` class is added to `.listexContainer`, which is useful for styling opened boxes.

The only other thing that needs noting is that disabled Listex options have the `disabled` class.

## TODO

- Support for `multiple="multiple"` lists.