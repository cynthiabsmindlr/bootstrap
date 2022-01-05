/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElementFromSelector,
  isDisabled,
  isVisible
} from './util/index'
import ScrollBarHelper from './util/scrollbar'
import EventHandler from './dom/event-handler'
import BaseComponent from './base-component'
import SelectorEngine from './dom/selector-engine'
import Backdrop from './util/backdrop'
import FocusTrap from './util/focustrap'
import { enableDismissTrigger } from './util/component-functions'

/**
 * Constants
 */

const NAME = 'offcanvas'
const DATA_KEY = 'bs.offcanvas'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`
const ESCAPE_KEY = 'Escape'

const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_SHOWING = 'showing'
const CLASS_NAME_HIDING = 'hiding'
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop'
const OPEN_SELECTOR = '.offcanvas.show'

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`

const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]'

const Default = {
  backdrop: true,
  keyboard: true,
  scroll: false
}

const DefaultType = {
  backdrop: 'boolean',
  keyboard: 'boolean',
  scroll: 'boolean'
}

/**
 * Class definition
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config)

    this._isShown = false
    this._backdrop = this._initializeBackDrop()
    this._focustrap = this._initializeFocusTrap()
    this._addEventListeners()
  }

  // Getters
  static get Default() {
    return Default
  }

  static get DefaultType() {
    return DefaultType
  }

  static get NAME() {
    return NAME
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, { relatedTarget })

    if (showEvent.defaultPrevented) {
      return
    }

    this._isShown = true
    this._backdrop.show()

    if (!this._config.scroll) {
      new ScrollBarHelper().hide()
    }

    this._element.setAttribute('aria-modal', true)
    this._element.setAttribute('role', 'dialog')
    this._element.classList.add(CLASS_NAME_SHOWING)

    const completeCallBack = () => {
      if (!this._config.scroll) {
        this._focustrap.activate()
      }

      this._element.classList.add(CLASS_NAME_SHOW)
      this._element.classList.remove(CLASS_NAME_SHOWING)
      EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget })
    }

    this._queueCallback(completeCallBack, this._element, true)
  }

  hide() {
    if (!this._isShown) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE)

    if (hideEvent.defaultPrevented) {
      return
    }

    this._focustrap.deactivate()
    this._element.blur()
    this._isShown = false
    this._element.classList.add(CLASS_NAME_HIDING)
    this._backdrop.hide()

    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW, CLASS_NAME_HIDING)
      this._element.removeAttribute('aria-modal')
      this._element.removeAttribute('role')

      if (!this._config.scroll) {
        new ScrollBarHelper().reset()
      }

      EventHandler.trigger(this._element, EVENT_HIDDEN)
    }

    this._queueCallback(completeCallback, this._element, true)
  }

  dispose() {
    this._backdrop.dispose()
    this._focustrap.deactivate()
    super.dispose()
  }

  // Private
  _initializeBackDrop() {
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible: this._config.backdrop,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: () => this.hide()
    })
  }

  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    })
  }

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
      if (this._config.keyboard && event.key === ESCAPE_KEY) {
        this.hide()
      }
    })
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config)

      if (typeof config !== 'string') {
        return
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`)
      }

      data[config](this)
    })
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  const target = getElementFromSelector(this)

  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault()
  }

  if (isDisabled(this)) {
    return
  }

  EventHandler.one(target, EVENT_HIDDEN, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus()
    }
  })

  // avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR)
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide()
  }

  const data = Offcanvas.getOrCreateInstance(target)
  data.toggle(this)
})

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const el of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(el).show()
  }
})

enableDismissTrigger(Offcanvas)

/**
 * jQuery
 */

defineJQueryPlugin(Offcanvas)

export default Offcanvas
