class Flock {
  constructor(n) {
    this.seagulls = n;
  }

  conjoin(other) {
    this.seagulls += other.seagulls;
    return this;
  }

  breed(other) {
    this.seagulls = this.seagulls * other.seagulls;
    return this;
  }
}

const flockA = new Flock(4);
const flockB = new Flock(2);
const flockC = new Flock(0);

const firstResult = flockA
  .conjoin(flockC)
  .breed(flockB)
  .conjoin(flockA.breed(flockB)).seagulls;

console.log(firstResult);
// 32

const conjoin = (flockX, flockY) => flockX + flockY;
const breed = (flockX, flockY) => flockX * flockY;

const FLOCK_A = 4;
const FLOCK_B = 2;
const FLOCK_C = 0;

const secondResult = conjoin(
  breed(conjoin(FLOCK_A, FLOCK_C), FLOCK_B),
  breed(FLOCK_A, FLOCK_B)
);

console.log(secondResult);
// 16

// conjoin(x, 0) === x
// conjoin(breed(x,y), breed(x,y)) === 2 * breed(x,y)

const thirdResult = 2 * breed(FLOCK_A, FLOCK_B);
console.log(thirdResult);
// 16

// also conjoin(breed(x,y), breed(x,y)) === breed(x, conjoin(y + y))
const fourthResult = breed(FLOCK_A, conjoin(FLOCK_B, FLOCK_B));
console.log(fourthResult);
// 16
