import styled from 'styled-components';
import Search from './Components/Search';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: row;
`;

function App() {
  return (
    <Wrapper>
      <Search />
    </Wrapper>
  );
}

export default App;
