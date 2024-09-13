import styled from 'styled-components';

export const Container = styled.span`
    cursor: pointer;
    margin: 0 10px;
    font-size: 25px;
    transition: transform 0.1s;
    &:hover {
        transform: scale(1.2);
    }
`;