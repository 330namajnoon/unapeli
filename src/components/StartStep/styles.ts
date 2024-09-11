import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    background-color: white;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

export const Button = styled.button`
    padding: 10px 30px;
    font-size: 25px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #0056b3;
    }
`;