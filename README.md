# 이더리움 토큰 탈중앙 거래소

## 프로젝트 목표

다양한 ERC20 토큰을 추가하여 거래할 수 있는 솔리디티 스마트 컨트렉트 제작

## Keep in mind

이더리움 스마트 컨트랙트는 기존 프로그래밍과 다른 몇가지 특징을 가지고 있는데그 중 코드 작성시에 가장 주의해야할 부분이 바로 각 연산마다 소모되는 가스비와 한번 배포하면 변경이 불가능한점이다
([upgradable smartcontract](https://steemit.com/kr/@kblock/64-upgradable-smart-contract)도 존재하긴한다.)
따라서 이더리움 스마트 컨트렉트 작성시 항상 가스비 절감과 보안적인 측면에 신경을 써야한다.

> > 예를들어 스토리지에 데이터를 저장하는 경우 32 바이트당 2 만가스라는 상당한 비용이 필요하기때문에스토리지를 변경해야하는 리스트에서의 sorting 함수들은 사용이 제한된다.

이러한 문제점을 피하고자 이 거래소 코드에서는 mapping 과 연결리스트의 형식을 사용하여 자료를 저장하였고,
오버플로우/언더플로우를 막기위해 SafeMath 라이브러리를 사용하였으며, 리플레이 어택 방지에도 신경을 썼다.

## 서비스 실행

현재 웹프론트엔드는 구축이 안되어있기때문에 [remix](http://remix.ethereum.org)에서 코드를 배포하고 실행해보길 바란다.

## 주요 기능

토큰 추가, 토큰 입/출금, 이더 입/출금, 시장가 구매/판매, 지정가 구매/판매, 거래 취소 등
