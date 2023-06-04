import styled from 'styled-components';

const Button = ({ text, onClick, onHover = '#5bb2ff' }) => {
  return (
    <ButtonStyle onClick={onClick} onHover={onHover}>
      {text}
    </ButtonStyle>
  );
};

const ButtonStyle = styled.button`
  width: 80px;
  height: 25px;
  border: 0;
  border-radius: 15px;
  transition: 0.2s;
  :hover {
    background-color: ${props => props.onHover};
  }
`;

export default Button;
