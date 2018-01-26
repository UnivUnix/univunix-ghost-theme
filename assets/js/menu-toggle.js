function activateMenuToggle (window, document) {
  var menu = document.querySelector('.header_unvx');
  var WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'onorientationchange' : 'resize';

  function toggleHorizontal () {
    [].forEach.call(
      document.querySelector('.header_unvx').querySelectorAll('.can-transform'),
      function (elem) {
        elem.classList.toggle('pure-menu-horizontal');
      }
    );
  }

  function toggleMenu () {
    // set timeout so that the panel has a chance to roll up
    // before the menu switches states
    if (menu.classList.contains('open')) {
      setTimeout(toggleHorizontal, 500);
    } else {
      toggleHorizontal();
    }
    menu.classList.toggle('open');
    document.getElementById('toggle').classList.toggle('toggled');
  }

  function closeMenu () {
    if (menu.classList.contains('open')) {
      toggleMenu();
    }
  }

  document.getElementById('toggle').addEventListener('click', function () {
    toggleMenu();
  });

  window.addEventListener(WINDOW_CHANGE_EVENT, closeMenu);
}

function activateAriaDropdown(window, document) {
  'use strict';

  // Enable drop-down menus in Pure
  // Inspired by YUI3 gallery-simple-menu by Julien LeComte
  // [https://github.com/yui/yui3-gallery/blob/master/src/gallery-simple-menu/js/simple-menu.js]

  function PureDropdown(dropdownParent) {

    var PREFIX = 'pure-';
    var ACTIVE_CLASS_NAME = PREFIX + 'menu-active';
    var ARIA_ROLE = 'role';
    var ARIA_HIDDEN = 'aria-hidden';
    var MENU_OPEN = 0;
    var MENU_CLOSED = 1;
    var MENU_PARENT_CLASS_NAME = 'pure-menu-has-children';
    var MENU_ACTIVE_SELECTOR = '.pure-menu-active';
    var MENU_LINK_SELECTOR = '.pure-menu-link';
    var MENU_SELECTOR = '.pure-menu-children';
    var DISMISS_EVENT = (window.hasOwnProperty &&
        window.hasOwnProperty('ontouchstart')) ?
        'touchstart' : 'mousedown';
    var ARROW_KEYS_ENABLED = true;
    var ddm = this; // drop down menu

    this._state = MENU_CLOSED;

    this.show = function () {
      if (this._state !== MENU_OPEN) {
        this._dropdownParent.classList.add(ACTIVE_CLASS_NAME);
        this._menu.setAttribute(ARIA_HIDDEN, false);
        this._state = MENU_OPEN;
      }
    };

    this.hide = function () {
      if (this._state !== MENU_CLOSED) {
        this._dropdownParent.classList.remove(ACTIVE_CLASS_NAME);
        this._menu.setAttribute(ARIA_HIDDEN, true);
        this._link.focus();
        this._state = MENU_CLOSED;
      }
    };

    this.toggle = function () {
      this[this._state === MENU_CLOSED ? 'show' : 'hide']();
    };

    this.halt = function (e) {
      e.stopPropagation();
      e.preventDefault();
    };

    this._dropdownParent = dropdownParent;
    this._link = this._dropdownParent.querySelector(MENU_LINK_SELECTOR);
    this._menu = this._dropdownParent.querySelector(MENU_SELECTOR);
    this._firstMenuLink = this._menu.querySelector(MENU_LINK_SELECTOR);

    // Set ARIA attributes
    this._link.setAttribute('aria-haspopup', 'true');
    this._menu.setAttribute(ARIA_ROLE, 'menu');
    this._menu.setAttribute('aria-labelledby', this._link.getAttribute('id'));
    this._menu.setAttribute('aria-hidden', 'true');
    [].forEach.call(
      this._menu.querySelectorAll('li'),
      function(el){
        el.setAttribute(ARIA_ROLE, 'presentation');
      }
    );
    [].forEach.call(
      this._menu.querySelectorAll('a'),
      function(el){
        el.setAttribute(ARIA_ROLE, 'menuitem');
      }
    );

    // Toggle on click
    this._link.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      ddm.toggle();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      var currentLink,
        previousSibling,
        nextSibling,
        previousLink,
        nextLink;

      // if the menu isn't active, ignore
      if (ddm._state !== MENU_OPEN) {
        return;
      }

      // if the menu is the parent of an open, active submenu, ignore
      if (ddm._menu.querySelector(MENU_ACTIVE_SELECTOR)) {
        return;
      }

      currentLink = ddm._menu.querySelector(':focus');

      // Dismiss an open menu on ESC
      if (e.keyCode === 27) {
      /* Esc */
        ddm.halt(e);
        ddm.hide();
      }
      // Go to the next link on down arrow
      else if (ARROW_KEYS_ENABLED && e.keyCode === 40) {
        /* Down arrow */
        ddm.halt(e);
        // get the nextSibling (an LI) of the current link's LI
        nextSibling = (currentLink) ? currentLink.parentNode.nextSibling : null;
        // if the nextSibling is a text node (not an element), go to the next one
        while (nextSibling && nextSibling.nodeType !== 1) {
          nextSibling = nextSibling.nextSibling;
        }
        nextLink = (nextSibling) ? nextSibling.querySelector('.pure-menu-link') : null;
        // if there is no currently focused link, focus the first one
        if (!currentLink) {
          ddm._menu.querySelector('.pure-menu-link').focus();
        }
        else if (nextLink) {
          nextLink.focus();
        }
      }
      // Go to the previous link on up arrow
      else if (ARROW_KEYS_ENABLED && e.keyCode === 38) {
        /* Up arrow */
        ddm.halt(e);
        // get the currently focused link
        previousSibling = (currentLink) ? currentLink.parentNode.previousSibling : null;
        while (previousSibling && previousSibling.nodeType !== 1) {
          previousSibling = previousSibling.previousSibling;
        }
        previousLink = (previousSibling) ? previousSibling.querySelector('.pure-menu-link') : null;
        // if there is no currently focused link, focus the last link
        if (!currentLink) {
          ddm._menu.querySelector('.pure-menu-item:last-child .pure-menu-link').focus();
        }
        // else if there is a previous item, go to the previous item
        else if (previousLink) {
          previousLink.focus();
        }
      }
    });

    // Dismiss an open menu on outside event
    document.addEventListener(DISMISS_EVENT, function (e) {
      var target = e.target;
      if (target !== ddm._link && !ddm._menu.contains(target)) {
        ddm.hide();
        ddm._link.blur();
      }
    });
  }

  function initDropdowns() {
    var dropdownParents = document.querySelectorAll('.pure-menu-has-children');
    for (var i = 0; i < dropdownParents.length; i++) {
      var ddm = new PureDropdown(dropdownParents[i]);
    }
  }

  initDropdowns();

}

activateAriaDropdown(this, this.document);
activateMenuToggle(this, this.document);
