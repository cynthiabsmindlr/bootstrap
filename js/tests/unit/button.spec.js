import Button from '../../src/button'

/** Test helpers */
import {
  getFixture,
  clearFixture,
  jQueryMock
} from '../helpers/fixture'

describe('Button', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Button.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('data-api', () => {
    it('should toggle active class on click', () => {
      fixtureEl.innerHTML = [
        '<button class="btn" data-bs-toggle="button">btn</button>',
        '<button class="btn testParent" data-bs-toggle="button"><div class="test"></div></button>'
      ].join('')

      const btn = fixtureEl.querySelector('.btn')
      const divTest = fixtureEl.querySelector('.test')
      const btnTestParent = fixtureEl.querySelector('.testParent')

      expect(btn.classList.contains('active')).toEqual(false)

      btn.click()

      expect(btn.classList.contains('active')).toEqual(true)

      btn.click()

      expect(btn.classList.contains('active')).toEqual(false)

      divTest.click()

      expect(btnTestParent.classList.contains('active')).toEqual(true)
    })
  })

  describe('toggle', () => {
    it('should toggle aria-pressed', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button" aria-pressed="false"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      expect(btnEl.getAttribute('aria-pressed')).toEqual('false')
      expect(btnEl.classList.contains('active')).toEqual(false)

      button.toggle()

      expect(btnEl.getAttribute('aria-pressed')).toEqual('true')
      expect(btnEl.classList.contains('active')).toEqual(true)
    })
  })

  describe('dispose', () => {
    it('should dispose a button', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      expect(Button.getInstance(btnEl)).toBeDefined()

      button.dispose()

      expect(Button.getInstance(btnEl)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should handle config passed and toggle existing button', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')
      const button = new Button(btnEl)

      spyOn(button, 'toggle')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock, 'toggle')

      expect(button.toggle).toHaveBeenCalled()
    })

    it('should create new button instance and call toggle', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock, 'toggle')

      expect(Button.getInstance(btnEl)).toBeDefined()
      expect(btnEl.classList.contains('active')).toEqual(true)
    })

    it('should just create a button instance without calling toggle', () => {
      fixtureEl.innerHTML = '<button class="btn" data-bs-toggle="button"></button>'

      const btnEl = fixtureEl.querySelector('.btn')

      jQueryMock.fn.button = Button.jQueryInterface
      jQueryMock.elements = [btnEl]

      jQueryMock.fn.button.call(jQueryMock)

      expect(Button.getInstance(btnEl)).toBeDefined()
      expect(btnEl.classList.contains('active')).toEqual(false)
    })
  })
})
