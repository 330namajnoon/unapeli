import styled from 'styled-components';

const getSize = (size: keyof {sm: "sm"; md: "md", lg: "lg"}) => {
    switch (size) {
        case "sm":
            return `
                min-width: 100px;
                min-height: 100px;
                max-width: 100px;
                max-height: 100px;
            `;
        case "md":
            return `
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

export const Video = styled.video<{visible?: boolean, size: keyof {sm: "sm"; md: "md", lg: "lg"}}>`
    position: fixed;
    transform: scale(-1, 1);
    top: 20px;
    left: 20px;
    z-index: 9999;
    border-radius: 50vw;
    ${props => getSize(props.size)}
    display: ${props => props.visible ? "block" : "none"};
    background-position: center;
    object-fit: cover;
    transition: transform 0.3s;
    cursor: pointer;
`;