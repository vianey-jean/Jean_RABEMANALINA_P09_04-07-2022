/**
 * @jest-environment jsdom
 */

/**
 * Ajout Nouvelle Import pour les nouveaux tests
 */

 import { screen, waitFor } from "@testing-library/dom";
 import userEvent from "@testing-library/user-event";
 import BillsUI from "../views/BillsUI.js";
 import { bills } from "../fixtures/bills.js";
 import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store";
 import Bills from "../containers/Bills.js";
 import router from "../app/Router.js";
 
 jest.mock("../app/store", () => mockStore);


describe("Étant donné que je suis connecté en tant qu'employé", () => {
  describe("Quand je suis sur la page Factures", () => {
    test("Ensuite, l'icône de la facture dans la disposition verticale doit être mise en surbrillance", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      /**
       * -----------------Ajout de "expect"--------------------------------------
       */
      expect(windowIcon.className).toBe("active-icon");
      /**
       * ------------------------------------------------------------------------
       */
    });
    test("Ensuite, les factures doivent être commandées du plus ancien au plus tard", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        ) //format yyyy mm dd
        .map((a) => a.innerHTML);

      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  /**
   * -----ajout nouveaux tests --------------
   * -----------------------------------------
   */
  describe("Quand je clique sur le bouton nouvelle facture", () => {
    test("Ensuite, le nouveau projet de loi modal devrait s'ouvrir", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const bill = new Bills({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const handleClickNewBill = jest.fn((e) => bill.handleClickNewBill(e));
      const buttonNewBill = screen.getByTestId("btn-new-bill");
      buttonNewBill.addEventListener("click", handleClickNewBill);
      userEvent.click(buttonNewBill);
      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });

  describe("Quand je clique sur une icone oeil", () => {
    test("Un modal devrait s'ouvrir avec une preuve de facture", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      document.body.innerHTML = BillsUI({ data: bills });
      $.fn.modal = jest.fn();

      const bill = new Bills({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const iconEye = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn((icon) =>
        bill.handleClickIconEye(icon)
      );
      iconEye.forEach((icon) => {
        icon.addEventListener("click", (e) => handleClickIconEye(icon));
        userEvent.click(icon);
      });

      expect(handleClickIconEye).toHaveBeenCalled();
      expect(screen.getAllByText("Justificatif")).toBeTruthy();
    });
  });
});

// test d'intégration GET
describe("Etant donné que je suis un utilisateur connecté en tant que Salarié", () => {
  describe("Lorsque j'accède à la page Factures", () => {
    test("récupère les factures de l'API simulée GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() =>
        expect(screen.getByText("Mes notes de frais")).toBeTruthy()
      );
    });
    describe("Lorsqu'une erreur se produit sur l'API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("récupère les factures d'une API et échoue avec une erreur de message 404", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
