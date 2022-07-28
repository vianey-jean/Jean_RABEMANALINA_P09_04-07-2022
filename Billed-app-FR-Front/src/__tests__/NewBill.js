/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

/**
 * Ajout des nouveaux Import pour nouvelles tests
 */
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

jest.mock("../app/store", () => mockStore);


describe("Étant donné que je suis connecté en tant qu'employé", () => {
  // [UNIT TEST] - Icon mail highlighting (MM)
  describe("Quand je suis sur la page NewBill", () => {
    test("Ensuite, l'icône de courrier dans la disposition verticale doit être mise en surbrillance", async () => {
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
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const windowMail = screen.getByTestId("icon-mail");
      //Vérifie si icon-window existe
      expect(windowMail).toBeTruthy();
      //vérifie si il y a bein la class active-icon'
      expect(windowMail.classList).toContain('active-icon');
    });
  });
});

describe("Étant donné que je suis connecté en tant qu'employé", () => {

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
    
  //Suite
  describe("Quand je suis sur la page NewBill", () => {
    test("Ensuite, l'icône de courrier dans la disposition verticale doit être mise en surbrillance", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);

      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon.className).toBe("active-icon");
    });
  });

  describe("lorsque je soumets le formulaire avec des champs vides", () => {
    test("alors je devrais rester sur la newBill", () => {
      window.onNavigate(ROUTES_PATH.NewBill);
      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      expect(screen.getByTestId("expense-name").value).toBe("");
      expect(screen.getByTestId("datepicker").value).toBe("");
      expect(screen.getByTestId("amount").value).toBe("");
      expect(screen.getByTestId("vat").value).toBe("");
      expect(screen.getByTestId("pct").value).toBe("");
      expect(screen.getByTestId("file").value).toBe("");

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(form).toBeTruthy();
    });
  });

  describe("lorsque je télécharge un fichier au mauvais format", () => {
    test("alors il devrait retourner un message d'erreur", async () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const file = new File(["hello"], "hello.txt", { type: "document/txt" });
      const inputFile = screen.getByTestId("file");

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);

      fireEvent.change(inputFile, { target: { files: [file] } });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].type).toBe("document/txt");
      await waitFor(() => screen.getByTestId("file-error-message"));
      expect(screen.getByTestId("file-error-message").classList).not.toContain(
        "hidden"
      );
    });
    test("alors il devrait retourner un message d'erreur", async () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        mockStore,
        localStorage: window.localStorage,
      });

      const file = new File(["hello"], "hello.pdf", { type: "document/pdf" });
      const inputFile = screen.getByTestId("file");

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);

      fireEvent.change(inputFile, { target: { files: [file] } });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].type).toBe("document/pdf");
      await waitFor(() => screen.getByTestId("file-error-message"));
      expect(screen.getByTestId("file-error-message").classList).not.toContain(
        "hidden"
      );
    });
  });

  

  describe("quand je télécharge un fichier avec le bon format", () => {
     // Vérifie si un fichier est bien chargé
     test("Vérifiez ensuite la facture du fichier", async() => {
      jest.spyOn(mockStore, "bills")

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }      

      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      Object.defineProperty(window, "location", { value: { hash: ROUTES_PATH['NewBill']} })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBillInit = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const file = new File(['image'], 'image.png', {type: 'image/png'});
      const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
      const formNewBill = screen.getByTestId("form-new-bill")
      const billFile = screen.getByTestId('file');

      billFile.addEventListener("change", handleChangeFile);     
      userEvent.upload(billFile, file)
      
      expect(billFile.files[0].name).toBeDefined()
      expect(handleChangeFile).toBeCalled()
     
      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);     
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    })
    
  });
});



//test d'intégration POST

describe("Étant donné que je suis connecté en tant qu'employé sur la page NewBill et que je soumets le formulaire", () => {
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
    document.body.append(root);
    router();
  });
  
  test("récupère les newbills à partir de l'API fictive POST", async () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))

    const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage})
    document.body.innerHTMLl = NewBillUI()
    
    const inputData = {
      type: 'Transports',
      name: 'essai',
      amount: '100',
      date: '2021-03-29',
      vat: '20',
      pct: '20',
      commentary: 'no',
      fileURL: 'thisURL',
      fileName: 'thisName',
    }

    const type = screen.getByTestId('expense-type')
    userEvent.selectOptions(type, screen.getAllByText('Transports'))
    expect(type.value).toBe(inputData.type)

    const name = screen.getByTestId('expense-name')
    fireEvent.change(name, {target: {value: inputData.name}})
    expect(name.value).toBe(inputData.name)

    const date = screen.getByTestId('datepicker')
    fireEvent.change(date, { target: {value: inputData.date} })
    expect(date.value).toBe(inputData.date)

    const vat = screen.getByTestId('vat')
    fireEvent.change(vat, { target: {value: inputData.vat} })
    expect(vat.value).toBe(inputData.vat)

    const pct = screen.getByTestId('pct')
    fireEvent.change(pct, { target: {value: inputData.pct} })
    expect(pct.value).toBe(inputData.pct)

    const comment = screen.getByTestId('commentary')
    fireEvent.change(comment, { target: { value: inputData.commentary } })
    expect(comment.value).toBe(inputData.commentary)

    const submitNewBill = screen.getByTestId('form-new-bill')
    
    const handleSubmit = jest.fn(newBill.handleSubmit)
    submitNewBill.addEventListener('submit', handleSubmit)
    fireEvent.submit(submitNewBill)
    expect(handleSubmit).toHaveBeenCalled()
    expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
  })


  describe("quand APi fonctionne bien", () => {
    test("alors je devrais être envoyé sur la page des factures avec les factures mises à jour", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorageMock,
      });

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      expect(mockStore.bills).toHaveBeenCalled();
    });

    describe("Lorsqu'une erreur se produit sur l'API", () => {
      test("alors il devrait afficher un message d'erreur", async () => {
        console.error = jest.fn();
        window.onNavigate(ROUTES_PATH.NewBill);
        mockStore.bills.mockImplementationOnce(() => {
          return {
            update: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const form = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
        form.addEventListener("submit", handleSubmit);

        fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalled();

        await new Promise(process.nextTick);

        expect(console.error).toHaveBeenCalled();
      });
    });  
  }); 
});

