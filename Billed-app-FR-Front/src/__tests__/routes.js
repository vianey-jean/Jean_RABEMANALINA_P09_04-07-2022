/**
 * @jest-environment jsdom
 */

import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { screen } from "@testing-library/dom"

const data = []
const loading = false
const error = null

describe('Étant donné que je suis connecté et que je suis sur une page de lapplication', () => {
  describe('Lorsque je navigue vers la page de connexion', () => {
    test(('Ensuite, il devrait rendre la page de connexion'), () => {
      const pathname = ROUTES_PATH['Login']
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Administration')).toBeTruthy()
    })
  })
  describe('Lorsque jaccède à la page Factures', () => {
    test(('Ensuite, il devrait afficher la page Factures'), () => {
      const pathname = ROUTES_PATH['Bills']
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
  describe('Lorsque je navigue vers la page NewBil', () => {
    test(('Ensuite, il devrait rendre la page NewBill'), () => {
      const pathname = ROUTES_PATH['NewBill']
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe('Lorsque je navigue vers le tableau de bord', () => {
    test(('Ensuite, il devrait rendre la page du tableau de bord'), () => {
      const pathname = ROUTES_PATH['Dashboard']
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Validations')).toBeTruthy()
    })
  })
  describe('Lorsque je navigue vers un autre endroit que Login, Bills, NewBill, Dashboard', () => {
    test(('Ensuite, il devrait rendre la page de connexion'), () => {
      const pathname = '/anywhere-else'
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Administration')).toBeTruthy()
    })
  })
})
