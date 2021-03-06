import React from 'react';
import { animated, interpolate } from 'react-spring';
import CardFront from '../components/CardFront';
import CardBack from '../components/CardBack';

// import { withDeck } from "../lib/DeckProvider";

const Card = ({cards, i, opacity, transform, bind, rot, scale, trans, isFlipped, chosenX, chosenY}) => {
  return (
    <animated.div className="cards nav-after" {...bind(i)} style={{ transform: interpolate([rot, scale], trans) }} >
      { isFlipped ? <CardBack cards={cards} i={i} opacity={opacity} transform={transform}/> : <CardFront cards={cards} i={i} opacity={opacity} transform={transform} chosenX={chosenX} chosenY={chosenY} /> }
    </animated.div>
  )
}

export default Card;
