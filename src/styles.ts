import styled from "styled-components";
const getSize = (size: keyof {sm: "sm"; md: "md", lg: "lg"}) => {
    switch (size) {
        case "sm":
            return `
                left: 20px;
                top: 20px;
                border-radius: 50%;
                min-width: 100px;
                min-height: 100px;
                max-width: 100px;
                max-height: 100px;
            `;
        case "md":
            return `
                left: 20px;
                top: 20px;
                border-radius: 50%;
                min-width: 200px;
                min-height: 200px;
                max-width: 200px;
                max-height: 200px;
            `;
        case "lg":
            return `
                top: 0px;
                left: 0px;
                border-radius: 0;
                min-width: 100vw;
                min-height: 100vh;
                max-width: 100vw;
                max-height: 100vh;
            `;
    }
}

const videosRadios = (size: keyof {sm: "sm"; md: "md", lg: "lg"}) => {

    switch (size) {
        case "sm":
            return `
                border-radius: 50%;
            `;
        case "md":
            return `
                border-radius: 50%;
            `;
        case "lg":
            return `
                border-radius: 0;
            `;
    }
}

export const VideoCallcontainer = styled.div<{size: keyof {sm: "sm"; md: "md", lg: "lg"}, rotate: number}>`
    ${props => getSize(props.size)}
    transform: rotateY(${props => props.rotate}deg);
    position: absolute;
    z-index: 9999;
    transform-style: preserve-3d;
    transition: transform 0.6s;

    video {
        ${props => videosRadios(props.size)}
    }
   
`;