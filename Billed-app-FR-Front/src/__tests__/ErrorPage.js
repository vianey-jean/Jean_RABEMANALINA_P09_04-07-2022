/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import ErrorPage from "../views/ErrorPage.js"

describe('Étant donné que je suis connecté sur lapplication (en tant quemployé ou administrateur RH)', () => {
  describe('Lorsque ErrorPage est appelé sans erreur dans sa signature', () => {
    test(('Ensuite, il devrait rendre ErrorPage sans message derreur'), () => {
      const html = ErrorPage()
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
      expect(screen.getByTestId('error-message').innerHTML.trim().length).toBe(0)
    })
  })
  describe('Lorsque ErrorPage est appelé avec un message derreur dans sa signature', () => {
    test(('Ensuite, il devrait rendre ErrorPage avec son message derreur'), () => {
      const error = 'Erreur de connexion internet'
      const html = ErrorPage(error)
      document.body.innerHTML = html
      expect(screen.getAllByText(error)).toBeTruthy()
    })
  })
})
