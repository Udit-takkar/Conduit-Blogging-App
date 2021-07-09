import React from "react";
import styled from "styled-components";
import LottieAnimation from "./Lottie";
import grape from "../../Animations/drawkit-grape-animation-5-LOOP.json";

function Banner() {
  return (
    <BannerContainer>
      <BannerText>
        <h1>conduit</h1>
        <h2>A place to share your knowledge.</h2>
      </BannerText>
      <LottieAnimation lotti={grape} height={250} width={300} />
    </BannerContainer>
  );
}
const BannerContainer = styled.div`
  min-width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 350px;
  background-color: #5cb85c;
`;
const BannerText = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;

  > h1 {
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 70px;
    color: white;
  }
  > h2 {
    margin-top: 0px;
    margin-bottom: 0px;
    color: white;
    letter-spacing: 2px;
  }
`;

export default Banner;
