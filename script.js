"use strict";

const FORM_ID = "support-form";
const MESSAGE_ID = "form-message";
const DEMO_PARAM = "demo";
const DEMO_VALUE = "1";
const PHONE_REGEX = /^[0-9+()\s-]{6,20}$/;
const MESSAGE_SUCCESS =
  "Merci, votre demande a bien été enregistrée.";
const MESSAGE_ERROR = "Merci de corriger les champs en erreur.";
const ERROR_REQUIRED = "Ce champ est obligatoire.";
const ERROR_PHONE = "Merci de saisir un numéro valide.";
const ERROR_DATE = "Merci de saisir une date valide.";

const FIELD_CONFIGS = [
  {
    id: "last-name",
    label: "Nom",
    validator: validateRequired,
  },
  {
    id: "first-name",
    label: "Prénom",
    validator: validateRequired,
  },
  {
    id: "birth-date",
    label: "Date de naissance",
    validator: validateBirthDate,
  },
  {
    id: "birth-place",
    label: "Lieu de naissance",
    validator: validateRequired,
  },
  {
    id: "address",
    label: "Adresse",
    validator: validateRequired,
  },
  {
    id: "phone",
    label: "Téléphone",
    validator: validatePhone,
  },
  {
    id: "reason",
    label: "Motif",
    validator: validateRequired,
  },
];

/**
 * Définit le message d'état du formulaire.
 * Entrées: formMessage (HTMLElement), message (string), isError (boolean).
 * Sorties: aucune.
 * Erreurs: aucune.
 */
function setFormMessage(formMessage, message, isError) {
  formMessage.textContent = message;
  formMessage.classList.toggle("form__message--error", isError);
}

/**
 * Retourne la valeur normalisée d'un champ.
 * Entrées: field (HTMLElement).
 * Sorties: string.
 * Erreurs: aucune.
 */
function getFieldValue(field) {
  return field.value.trim();
}

/**
 * Valide un champ requis.
 * Entrées: value (string).
 * Sorties: string (message vide si OK).
 * Erreurs: aucune.
 */
function validateRequired(value) {
  if (value.length === 0) {
    return ERROR_REQUIRED;
  }

  return "";
}

/**
 * Valide le numéro de téléphone.
 * Entrées: value (string).
 * Sorties: string (message vide si OK).
 * Erreurs: aucune.
 */
function validatePhone(value) {
  if (value.length === 0) {
    return ERROR_REQUIRED;
  }

  if (!PHONE_REGEX.test(value)) {
    return ERROR_PHONE;
  }

  return "";
}

/**
 * Valide la date de naissance.
 * Entrées: value (string).
 * Sorties: string (message vide si OK).
 * Erreurs: aucune.
 */
function validateBirthDate(value) {
  if (value.length === 0) {
    return ERROR_REQUIRED;
  }

  const parsedDate = new Date(value);
  const dateTimestamp = parsedDate.getTime();

  if (Number.isNaN(dateTimestamp)) {
    return ERROR_DATE;
  }

  const nowTimestamp = Date.now();

  if (dateTimestamp > nowTimestamp) {
    return ERROR_DATE;
  }

  return "";
}

/**
 * Valide un champ et met à jour le message d'erreur associé.
 * Entrées: field (HTMLElement), validator (Function).
 * Sorties: boolean (true si valide).
 * Erreurs: aucune.
 */
function validateField(field, validator) {
  const errorElement = document.getElementById(`${field.id}-error`);
  const value = getFieldValue(field);
  const errorMessage = validator(value);

  errorElement.textContent = errorMessage;

  return errorMessage.length === 0;
}

/**
 * Valide l'ensemble des champs du formulaire.
 * Entrées: aucune.
 * Sorties: boolean.
 * Erreurs: aucune.
 */
function validateForm() {
  let isValid = true;

  FIELD_CONFIGS.forEach((fieldConfig) => {
    const field = document.getElementById(fieldConfig.id);
    const fieldIsValid = validateField(field, fieldConfig.validator);

    if (!fieldIsValid) {
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Nettoie les messages d'erreur du formulaire.
 * Entrées: aucune.
 * Sorties: aucune.
 * Erreurs: aucune.
 */
function clearErrors() {
  FIELD_CONFIGS.forEach((fieldConfig) => {
    const errorElement = document.getElementById(`${fieldConfig.id}-error`);

    errorElement.textContent = "";
  });
}

/**
 * Remplit le formulaire avec un jeu de données de démonstration.
 * Entrées: aucune.
 * Sorties: aucune.
 * Erreurs: aucune.
 */
function applyDemoData() {
  document.getElementById("last-name").value = "Dupont";
  document.getElementById("first-name").value = "Camille";
  document.getElementById("birth-date").value = "1994-06-15";
  document.getElementById("birth-place").value = "Lyon";
  document.getElementById("address").value = "12 rue Exemple, 69000 Lyon";
  document.getElementById("phone").value = "+33 6 12 34 56 78";
  document.getElementById("reason").value = "suspended";
}

/**
 * Applique la démo si le paramètre d'URL est présent.
 * Entrées: aucune.
 * Sorties: aucune.
 * Erreurs: aucune.
 */
function runDemoIfEnabled() {
  const params = new URLSearchParams(window.location.search);
  const demoFlag = params.get(DEMO_PARAM);

  if (demoFlag === DEMO_VALUE) {
    applyDemoData();
  }
}

/**
 * Gère la soumission du formulaire.
 * Entrées: event (SubmitEvent).
 * Sorties: aucune.
 * Erreurs: aucune.
 */
function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  const formMessage = document.getElementById(MESSAGE_ID);
  const isValid = validateForm();

  if (!isValid) {
    setFormMessage(formMessage, MESSAGE_ERROR, true);
    return;
  }

  setFormMessage(formMessage, MESSAGE_SUCCESS, false);
}

/**
 * Initialise le formulaire.
 * Entrées: aucune.
 * Sorties: aucune.
 * Erreurs: aucune.
 */
function initializeForm() {
  const form = document.getElementById(FORM_ID);
  const message = document.getElementById(MESSAGE_ID);

  if (!form) {
    return;
  }

  if (!message) {
    return;
  }

  form.addEventListener("submit", handleSubmit);
  runDemoIfEnabled();
}

initializeForm();
