import { useState } from 'react';
import styled from 'styled-components';
import Kakaomap from './KaKaomap';
import { equidistantPoint } from './apis/api';
import Button from './atoms/Button';

const Search = () => {
  const [value, setValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [start, setStart] = useState([]);
  const [showResult, setShowResult] = useState(null);
  const [reset, setReset] = useState(false);

  const handleStart = coords => {
    const newStart = [...start];
    newStart.push(coords);
    setStart(newStart);
  };

  const onChange = e => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const submit = e => {
    e.preventDefault();
    setKeyword(value);
    setShowResult(null);
  };

  const getCategory = input => {
    const reg = />(.*?)>/;
    const match = input.match(reg);

    if (match && match[1]) {
      return match[1].trim();
    }

    return null;
  };

  const deleteStart = index => {
    const newStart = [...start];
    newStart.splice(index, 1);
    setStart(newStart);
  };

  return (
    <>
      <Info>
        <>
          <form onSubmit={submit}>
            <Input
              onChange={onChange}
              value={value || ''}
              placeholder="키워드로 위치 검색하기"
            />
            {/* <button onClick={() => value}>검색</button> */}
          </form>
          <AllResults>
            {searchResults.map((el, idx) => {
              return (
                <ResultContainer key={el.id}>
                  <Marker idx={idx + 1} />
                  <div>
                    <Address>{el.place_name}</Address>
                    <Category>{getCategory(el.category_name)}</Category>
                    <div>{el.address_name}</div>
                    <Button
                      onClick={() => {
                        const x = +el.x,
                          y = +el.y,
                          name = el.place_name;
                        const startEntry = { x, y, name };

                        if (
                          !start.some(
                            each =>
                              each.x === startEntry.x &&
                              each.y === startEntry.y &&
                              each.name === startEntry.name
                          )
                        ) {
                          handleStart(startEntry);
                        }
                      }}
                      text={'출발지 등록'}
                    ></Button>
                  </div>
                </ResultContainer>
              );
            })}
          </AllResults>
        </>
        <Button
          onClick={() => {
            setShowResult(equidistantPoint(start));
          }}
          text={'결과보기'}
        ></Button>
        <Button
          onClick={() => {
            setKeyword('');
            setSearchResults([]);
            setValue('');
            setShowResult(null);
            setStart([]);
            setReset(prev => !prev);
          }}
          text={'초기화'}
          onHover="red"
          margin="5px"
        ></Button>
        <>
          {start.map((el, i) => {
            return (
              <Starts key={el.x + el.y} onClick={() => deleteStart(i)}>
                {el.name}
              </Starts>
            );
          })}
        </>
      </Info>
      <Map>
        <Kakaomap
          searchKeyword={keyword || ''}
          setSearchResults={setSearchResults}
          showResult={showResult}
          start={start}
          reset={reset}
          setReset={setReset}
        />
      </Map>
    </>
  );
};

const Info = styled.div`
  position: relative;
  z-index: 3;
  width: 350px;
  /* background-color: #f6f6f6; */
  background-color: white;
  /* border-right: 0.5px solid gray; */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Map = styled.div`
  position: relative;
  z-index: 1;
  width: 100vw;
  height: 100vh;
`;

const Input = styled.input`
  width: 300px;
  height: 30px;
  margin: 10px;
`;

const ResultContainer = styled.div`
  width: 100%;
  height: 90px;
  border-top: 0.1px solid lightgray;
`;

const AllResults = styled.div`
  width: 100%;
  height: 500px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #2f3542;
    height: 20px;
  }
  ::-webkit-scrollbar-track {
    background: lightgrey;
  }
`;

const Address = styled.span`
  color: #2772cf;
  font-weight: 600;
  margin-right: 10px;
`;

const Category = styled.span`
  color: gray;
  font-size: small;
`;

const Marker = styled.div`
  float: left;
  width: 36px;
  height: 37px;
  margin: 10px 0 0 10px;
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png)
    no-repeat;
  background-position: ${({ idx }) => `0 ${36 - 46 * idx}px`};
`;

const Starts = styled.button`
  background-color: lightblue;
`;

export default Search;
