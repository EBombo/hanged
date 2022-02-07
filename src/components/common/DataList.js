import { config } from "../../firebase";

export const avatars = [
  `${config.storageUrl}/resources/avatars/dog.svg`,
  `${config.storageUrl}/resources/avatars/fox.svg`,
  `${config.storageUrl}/resources/avatars/deer.svg`,
  `${config.storageUrl}/resources/avatars/cat.svg`,
  `${config.storageUrl}/resources/avatars/cow.svg`,
  `${config.storageUrl}/resources/avatars/pig.svg`,
  `${config.storageUrl}/resources/avatars/monkey.svg`,
  `${config.storageUrl}/resources/avatars/chicken.svg`,
  `${config.storageUrl}/resources/avatars/panda.svg`,
];

export const adminMenus = [
  {
    value: "home",
    url: "/home",
  },
  {
    value: "users",
    url: "/admin/users",
  },
  {
    value: "manifests",
    url: "/admin/settings/manifests",
  },
  {
    value: "templates",
    url: "/admin/settings/templates",
  },
  {
    value: "seo",
    url: "/admin/seo",
  },
];

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const defaultHandMan = {
  rightLeg: "hidden",
  leftLeg: "hidden",
  rightArm: "hidden",
  leftArm: "hidden",
  trunk: "hidden",
  head: "hidden",
};

export const limbsOrder = Object.keys(defaultHandMan);

export const secondsPerRoundOptions = [null, 20, 30, 40, 50, 60];

export const PLAYING = "PLAYING";
export const TIME_OUT = "TIME_OUT";
export const HANGED = "HANGED";
export const GUESSED = "GUESSED";
export const SKIP_PHRASE = "SKIP_PHRASE";


export const tildes = {
  'a': 'á',
  'e': 'é',
  'i': 'í',
  'o': 'ó',
  'u': 'ú',
  'A': 'Á',
  'E': 'É',
  'I': 'Í',
  'O': 'Ó',
  'U': 'Ú',
};


export const skippedWords = ";:!¡?¿ ";

export const MAX_PHRASE_LENGTH = 50;

export const allowedLetters = new RegExp("^[a-zA-ZñÑáéíóúÁÉÍÓÚ, ¿?!¡:;]*$");

export const bannedLetters = new RegExp("[^a-zA-ZñÑáéíóúÁÉÍÓÚ, ¿?!¡:;]", "g");
 

