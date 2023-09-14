import styled from 'styled-components';

const Button = ({ text, onClick, margin = '0px', onHover = '#5bb2ff' }) => {
  return (
    <ButtonStyle onClick={onClick} onHover={onHover} margin={margin}>
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
  margin: ${props => props.margin};
`;

export default Button;
