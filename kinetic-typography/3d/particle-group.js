import {Particle} from "./particle.js";
import {distance, pointCircle} from "./utils.js";

const DEFAUL_ANGLE = 90 * Math.PI / 180;
const GRAVITY = 0.3;
const VERTICAL_RATE = 0.3;
const MOUSE_PULL_RATE = 0.3
const FRICTION = 0.97
