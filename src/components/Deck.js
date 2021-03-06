import React, { useState } from 'react'

import { useSpring, useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-with-gesture'
import Card from '../components/Card';

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, y: i * -4, rot: 0, scale: 1.5 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(5deg) rotateY(${r / 10}deg) rotateZ(${r/1.25}deg) scale(${s})`;

const Deck = ({cards, respond}) => {
  const [chosenX, setChosenX] = useState(null);
  const [chosenY, setChosenY] = useState(null);
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [isFlipped, setIsFlipped] = useState(false)
  const [opCards, setOpCards] = useSprings(cards.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above
  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${isFlipped ? 180 : 0}deg)`,
    config: { mass: 7, tension: 500, friction: 80 }
  })

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    setOpCards(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.15 : 1 // Active cards lift up a bit
      // Let's us know if the card has been lifted
      if (down && x<0) {
          setChosenX({
            fontWeight: 800,
            color: '#292824',
          }) 
          setChosenY(null);
      } else if (down && x>0) {
        setChosenY({
          fontWeight: 800,
          color: '#292824',
        });
        setChosenX(null);
      } else {
        setChosenX(null);
        setChosenY(null)
      }
      // Tells us which way the card has gone
      if (isGone && x>1) { 
        respond(i, 'y');
      } else if (isGone && x<-1) {
        respond(i, 'x');
      }
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    // if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || setOpCards(i => to(i)), 600) // It makes the cards return after there are none left
  })

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return opCards.map(({ x, y, rot, scale }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x/2}px,${y/2.5}px,0)`) }} onDoubleClick={() => setIsFlipped(state => !state)}>
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <Card cards={cards} i={i} opacity={opacity} transform={transform} bind={bind} rot={rot} scale={scale} trans={trans} isFlipped={isFlipped} chosenX={chosenX} chosenY={chosenY}/>
    </animated.div>
  ))
}

export default Deck;
