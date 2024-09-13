import styled from 'styled-components'

export const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    * {
        color: white;
    }
`;