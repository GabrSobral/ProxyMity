export const options = {
  accessory: ['none', 'roundGlasses', 'tinyGlasses', 'shades', undefined],
  body: ['chest', 'breasts', undefined],
  circleColor: ['blue', undefined],
  clothing: [
    'naked',
    'shirt',
    'dressShirt',
    'vneck',
    'tankTop',
    'dress',
    undefined,
  ],
  clothingColor: ['blue', 'white', 'black', 'green', 'red', undefined],
  eyebrows: [
    'raised',
    'leftLowered',
    'serious',
    'angry',
    'concerned',
    undefined,
  ],
  eyes: [
    'normal',
    'leftTwitch',
    'happy',
    'content',
    'squint',
    'simple',
    'dizzy',
    'wink',
    'heart',
    undefined,
  ],
  faceMask: [true, false],
  faceMaskColor: ['blue', 'white', 'black', 'green', 'red', undefined],
  facialHair: ['none', 'none2', 'none3', 'stubble', 'mediumBeard', undefined],
  graphic: ['none', 'redwood', 'gatsby', 'vue', 'react', 'graphQL', undefined],
  hair: [
    'none',
    'long',
    'bun',
    'short',
    'pixie',
    'balding',
    'buzz',
    'afro',
    'bob',
    undefined,
  ],
  hairColor: [
    'blue',
    'white',
    'black',
    'blonde',
    'orange',
    'brown',
    'pink',
    undefined,
  ],
  hat: [
    'none',
    'none2',
    'none3',
    'none4',
    'none5',
    'beanie',
    'turban',
    undefined,
  ],
  hatColor: ['blue', 'white', 'black', 'green', 'red', undefined],
  lashes: [true, false],
  lipColor: ['green', 'red', 'pink', 'purple', 'turqoise', undefined],
  mouth: [
    'grin',
    'sad',
    'openSmile',
    'lips',
    'open',
    'serious',
    'tongue',
    undefined,
  ],
  skinTone: ['black', 'red', 'brown', 'light', 'yellow', 'dark', undefined],
};

export function generateAvatar() {
  const config = {
    accessory: null,
    body: null,
    circleColor: null,
    clothing: null,
    clothingColor: null,
    eyebrows: null,
    eyes: null,
    faceMask: null,
    faceMaskColor: null,
    facialHair: null,
    graphic: null,
    hair: null,
    hairColor: null,
    hat: null,
    hatColor: null,
    lashes: null,
    lipColor: null,
    mouth: null,
    skinTone: null,
  };
  const optionsArr = Object.entries(options);

  optionsArr.forEach((item) => {
    const [key, values] = item;

    Object.defineProperty(config, key, {
      value: values[Math.floor(Math.random() * (values.length - 1))],
      writable: false,
    });
  });

  return { ...config };
}
