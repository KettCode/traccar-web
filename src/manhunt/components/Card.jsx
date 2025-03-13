import React, { useEffect, useState } from 'react';

const Card = ({
    cardFront,
    cardBack,
    showBack
}) => {
    return (
        <>
            <div class="cards-wrapper">
                <div class="card-container">
                    <div class="card" style={{
                        transform: showBack ? "rotateY(-180deg)" : "none"
                    }}>
                        <div class="card-contents card-front">
                            {cardFront()}
                        </div>
                        <div class="card-contents card-back">
                            {cardBack()}
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {
                    `
                .cards-wrapper {
                  
                }
                .card-container {
                  perspective: 1200px;
                }
                .card {
                  margin: 0 auto;
                  border-radius: 50%;
                  width: 300px;
                  height: 300px;
                  position: relative;
                  transition: all 3s ease;
                  transform-style: preserve-3d;
                  box-shadow: 1px 3px 3px rgba(0,0,0,0.2)
                }

                .card-contents {
                  border-radius: 50%;
                  padding: 20px;
                  font-size: 14px;
                  width: 300px;
                  height: 300px;
                  margin-bottom: 2;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  gap: 5px;
                  align-items: center;
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                  color: #fff;
                  background-color: #1976d2;
                  background: radial-gradient(circle at 100px 100px, #5cabff, #000);
                  text-align: center;
                  position: absolute;
                  top: 0;
                  left: 0;
                  backface-visibility: hidden;
                }
                .card-depth {
                  transform: translateZ(120px) scale(0.98);
                  perspective: inherit;
                }
                .card-depth-icon {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  color: rgba(255, 255, 255, 0.3);
                  z-index: 1;
                  transform: translateZ(70px);
                }
                .card-front {       
                  transform-style: preserve-3d;
                }
                .card-back {
                  transform: rotateY(180deg);
                  transform-style: preserve-3d;
                }
                `
                }
            </style>
        </>
    );
};

export default Card;




