import cilender from "../assets/cilender-escalator.jpg";
import press from "../assets/gidrocilindr_press.jpg";
import complect from "../assets/complect-manjet.jpg";
import cuffs from "../assets/cuffs.jpg";

const productMediaMap = {
  "cilender-escalator": cilender,
  "gidrocilindr-press": press,
  "complect-manjet": complect,
  cuffs,
};

export function resolveProductImage(imageKey) {
  return productMediaMap[imageKey] || cilender;
}
