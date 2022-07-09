/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import Actions from "../views/Actions.js"
import '@testing-library/jest-dom/extend-expect'


describe('Étant donné que je suis connecté en tant quemployé', () => {
  describe('Quand je suis sur la page Factures et quil y a des factures', () => {
    test(('Ensuite, il devrait rendre licône oeil'), () => {
      const html = Actions()
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-eye')).toBeTruthy()
    })
  })
  describe('Lorsque je suis sur la page Factures et quil y a des factures avec lURL du fichier', () => {
    test(('Ensuite, il doit enregistrer lURL donnée dans lattribut personnalisé data-bill-url'), () => {
      const url = '/fake_url'
      const html = Actions(url)
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', url)
    })
  })
})
