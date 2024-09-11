import styled from 'styled-components';

export const Video = styled.video<{display?: string}>`
    position: absolute;
    transform: scale(-1, 1);
    top: 20px;
    left: 20px;
    z-index: 1000;
    min-width: 100px;
    min-height: 100px;
    max-width: 100px;
    max-height: 100px;
    border-radius: 50vw;
    display: ${props => props.display};
    background-position: center;
    object-fit: cover;
`;