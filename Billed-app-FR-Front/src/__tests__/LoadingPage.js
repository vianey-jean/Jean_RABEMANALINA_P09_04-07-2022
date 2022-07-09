/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import LoadingPage from "../views/LoadingPage.js"

describe('Étant donné que je suis connecté sur lapplication (en tant quemployé ou administrateur RH)', () => {
  describe('Lorsque LoadingPage est appelée', () => {
    test(('Ensuite, il devrait rendre Loading...'), () => {
      const html = LoadingPage()
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
})
