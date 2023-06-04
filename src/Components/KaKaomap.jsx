/* global kakao */
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import FlagIcon from './atoms/map-marker-flag-icon.svg';
import NumberIcon from './atoms/marker_number_blue.png';

const Map = styled.div`
  /* width: 100vw; */
  height: 100vh;
`;

function addMarker(position, idx, _) {
  const imageSrc = NumberIcon,
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });
  // marker.setMap(kakaoMap); // 지도 위에 마커를 표출합니다

  return marker;
}

const Kakaomap = props => {
  const {
    searchKeyword,
    setSearchResults,
    showResult,
    start,
    reset,
    setReset,
  } = props;

  const container = useRef(null);
  const [bound, setBound] = useState(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [startMarkers, setStartMarkers] = useState([]);
  const [answer, setAnswer] = useState(null);

  function removeStartMarkers() {
    for (const marker of startMarkers) {
      console.log(marker);
      marker.setMap(null);
    }
  }
  function removeMarkers() {
    for (const mark of markers) {
      mark.setMap(null);
    }
  }

  useEffect(() => {
    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(37.541, 126.986),
        level: 7,
      };
      // 지도 생성
      const map = new kakao.maps.Map(container.current, options);

      setKakaoMap(map);
      setBound(new kakao.maps.LatLngBounds());
    });
  }, []);

  useEffect(() => {
    removeMarkers();
    if (showResult) {
      if (answer) {
        answer.setMap(null);
      }

      const moveLatLng = new kakao.maps.LatLng(showResult.y, showResult.x);

      const icon = new kakao.maps.MarkerImage(
        FlagIcon,
        new kakao.maps.Size(31, 35)
      );

      const marker = new kakao.maps.Marker({
        position: moveLatLng,
        image: icon,
      });
      marker.setMap(kakaoMap);
      setAnswer(marker);

      kakaoMap.panTo(moveLatLng);
    }
    if (reset === true) {
      if (answer) {
        answer.setMap(null);
      }
      setReset(false);
    }
  }, [showResult, reset]);

  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }

    const ps = new kakao.maps.services.Places();

    if (!showResult) {
      searchPlaces();
      removeMarkers();
    }

    function searchPlaces() {
      if (!searchKeyword.replace(/^\s+|\s+$/g, '')) {
        console.log('키워드를 입력해주세요!');
        return false;
      }
      // 장소검색 객체를 통해 키워드로 장소검색을 요청
      ps.keywordSearch(searchKeyword, placesSearchCB);
    }

    function placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(data);
        displayPlaces(data);
        // 검색결과로 지도 범위 재설정
        setBound(new kakao.maps.LatLngBounds());

        bound.extend(new kakao.maps.LatLng(data[0].y, data[0].x));

        kakaoMap.setBounds(bound);
        kakaoMap.setLevel(4);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    }

    function displayPlaces(places) {
      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarkers();

      const mark = [];

      for (let i = 0; i < places.length; i++) {
        // 마커 생성하고 지도에 표시
        const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
        mark.push(addMarker(placePosition, i));
        // bound.extend(placePosition);
      }
      setMarkers(mark);
    }
  }, [searchKeyword, showResult, kakaoMap]);

  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }
    for (const marker of markers) {
      marker.setMap(kakaoMap);
    }
  }, [markers]);

  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }
    removeStartMarkers();

    const newMarkers = [];

    for (const each of start) {
      const markerPosition = new kakao.maps.LatLng(each.y, each.x);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(kakaoMap);
      newMarkers.push(marker);
    }

    setStartMarkers(newMarkers);
  }, [start]);

  return <Map ref={container}></Map>;
};

export default Kakaomap;
