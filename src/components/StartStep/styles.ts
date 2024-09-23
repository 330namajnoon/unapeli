import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    background-color: #000333;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    z-index: 10000;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const UserView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    z-index: 10000;
    width: 100%;
`;

export const Name = styled.h2`
    font-size: 30px;
    color: white;
    background: #000725;
    width: 100%;
    text-align: center;
    box-shadow: inset 0px 0px 13px 0px #00ff26;
    padding: 10px;
    border-radius: 5px;
`;

export const LocalVideo = styled.video`
    width: 25vw;
    border-radius: 10px;
    box-shadow: -1px -2px 7px 7px #000994;
    border: solid 2px #535a89;
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
    width: 100%;
    box-shadow: 1px 1px 4px 4px #4c459c;
`;