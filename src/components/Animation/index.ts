import styled from 'styled-components'

export const FadeInAnimation = styled.div`
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-10%);
    }
    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }
  animation-name: fadeIn;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
  animation-duration: 1s;
`
