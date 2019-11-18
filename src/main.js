// Must have npm install --global --production windows-build-tools installed
const fs = require('fs');
const path = require('path');

const { screen } = require('robotjs');
const Jimp = require('jimp');

const ICON_WIDTH = 50;
const ICON_HEIGHT = 50;

const loadImages = async src => Promise.all(src.map(i => Jimp.read(i.path)));
const init = async () => {
  const imgPool = [
    {
      name: 'test',
      path: './assets/test1.png',
    },
  ];

  const images = await loadImages(imgPool);
  for (let i = 0; i < imgPool.length; i++) {
    imgPool[i].image = images[i];
  }

  return { imgPool };
};

const compare = async (shot, imgPool) => {
  const processedShot = await new Jimp({
    data: shot.image,
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
  });

  let i = 0;
  let distance;
  let diff;
  for (; i < imgPool.length; i++) {
    distance = Jimp.distance(processedShot, imgPool[i].image); // perceived distance
    diff = Jimp.diff(processedShot, imgPool[i].image); // pixel difference

    if (distance < 0.15 || diff.percent < 0.15) {
      console.log('equal');
    } else {
      console.log('different');
    }
  }
};

(async () => {
  const { imgPool } = await init();
  let shot;
  while (true) {
    shot = screen.capture(0, 0, ICON_WIDTH, ICON_HEIGHT);
    await new Promise(ok => setTimeout(() => ok(compare(shot, imgPool)), 1000));
  }
})();
