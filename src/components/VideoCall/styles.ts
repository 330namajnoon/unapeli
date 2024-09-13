import styled from 'styled-components';

export const Video = styled.video`
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: black;
    min-height: 100%;
    min-width: 100%;
    max-height: 100%;
    max-width: 100%;
    background-position: center;
    object-fit: cover;
    transition: transform 0.3s;
    backface-visibility: hidden;
    cursor: pointer;
`;