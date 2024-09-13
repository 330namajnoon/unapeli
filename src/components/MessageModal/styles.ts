import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    z-index: 999;
    left: 0;
    top: 0;
`;

export const Message = styled.div`
    position: absolute;
    z-index: 1001;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 100px;
    font-size: 30px;
`;

export const MessageSend = styled.div`
    position: absolute;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
`;

export const MessageTextInput = styled.input`
    font-size: 20px;
    min-width: 25vw;
    border-radius: 5px 0 0 5px;
    border: solid 1px gray;
    padding: 10px;
    background-color: transparent;
    color: white;
    outline: none;
`;

export const MessageSendButton = styled.span`
    font-size: 25px;
    padding: 10px;
    border-radius: 0 5px 5px 0;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #0056b3;
    }
`;