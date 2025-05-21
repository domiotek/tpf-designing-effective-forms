let clickCount = 0;

const countryInput = document.getElementById("country");
const myForm = document.getElementById("form");
const modal = document.getElementById("form-feedback-modal");
const clicksInfo = document.getElementById("click-count");

function handleClick() {
  clickCount++;
  clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Błąd pobierania danych");
    }
    const data = await response.json();
    const countries = data.map((country) => country.name.common);
    countryInput.innerHTML = countries
      .map((country) => `<option value="${country}">${country}</option>`)
      .join("");
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
}

function getCountryByIP() {
  fetch("https://get.geojs.io/v1/ip/geo.json")
    .then((response) => response.json())
    .then((data) => {
      const country = data.country;

      countryInput.value = country;

      getCountryCode(country);
    })
    .catch((error) => {
      console.error("Błąd pobierania danych z serwera GeoJS:", error);
    });
}

function getCountryCode(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Błąd pobierania danych");
      }
      return response.json();
    })
    .then((data) => {
      const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
      document.querySelector("#countryCode").value = countryCode;
      document.querySelector("#vatCountryCode").value = countryCode;
    })
    .catch((error) => {
      console.error("Wystąpił błąd:", error);
    });
}

function bindNameLogic($firstName = "#firstName", $lastName = "#lastName") {
  const firstName = document.querySelector($firstName);
  const lastName = document.querySelector($lastName);

  firstName.addEventListener("keydown", function (e) {
    if ((e.key === " " || e.key === "ArrowRight") && e.target.checkValidity()) {
      lastName.focus();
    }
  });

  lastName.addEventListener("keydown", function (e) {
    if (
      e.key === "ArrowLeft" ||
      (e.key === "Backspace" && e.target.value === "")
    ) {
      firstName.focus();
    }
  });

  firstName.focus();
}

function bindPhoneLogic() {
  const countryCode = document.querySelector("#countryCode");
  const phoneNumber = document.querySelector("#phoneNumber");

  countryCode.addEventListener("change", function (e) {
    phoneNumber.focus();
  });
}

function bindVatLogic() {
  const vatCheck = document.querySelector("#vatUE");
  const vatSection = document.querySelector("#vatSection");
  const vatNumber = document.querySelector("#vatNumber");

  vatCheck.addEventListener("change", function (e) {
    vatSection.classList.toggle("hidden", !e.target.checked);
    vatNumber.toggleAttribute("required", e.target.checked);

    if (e.target.checked) {
      document.querySelector("#vatNumber").focus();
    }
  });

  const otherDataCheck = document.querySelector("#otherVatDataCheck");
  const otherDataSection = document.querySelector("#otherVatDataSection");
  const firstName = document.querySelector("#vatFirstName");
  const lastName = document.querySelector("#vatLastName");
  const phoneNUmber = document.querySelector("#vatPhoneNumber");

  otherDataCheck.addEventListener("change", function (e) {
    otherDataSection.classList.toggle("hidden", !e.target.checked);
    firstName.toggleAttribute("required", e.target.checked);
    lastName.toggleAttribute("required", e.target.checked);
    phoneNUmber.toggleAttribute("required", e.target.checked);

    if (e.target.checked) {
      document.querySelector("#vatFirstName").focus();
    }
  });

  bindNameLogic("#vatFirstName", "#vatLastName");
}

function bindFormLogic() {
  const form = document.querySelector("#form");

  document
    .getElementById("submitButton")
    .addEventListener("click", function () {
      form.classList.add("was-validated");

      if (form.checkValidity()) {
        const modal = new bootstrap.Modal(
          document.getElementById("form-feedback-modal")
        );
        modal.show();
      } else {
        console.error(
          "Form is invalid. Please correct the errors and try again."
        );
        form.reportValidity();
      }
    });
}

(async () => {
  // nasłuchiwania na zdarzenie kliknięcia myszką
  document.addEventListener("click", handleClick);

  await fetchAndFillCountries();
  getCountryByIP();

  bindNameLogic();
  bindPhoneLogic();
  bindVatLogic();
  bindFormLogic();
})();
