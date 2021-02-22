`21.02.22.(화)
- 목표 : 주어진 실의 맨처음 시작점 찾기
나에게 모두 깜깜한 방에 실타래가 중간부터 주어졌다고 하자 이 실의 맨 처음을 확인하는 방법은 무엇일까?
- 1) 실을 당긴다.
- 2) 처음 실의 끝에서 나타나는 패턴을 확인해본다.

# 1) 실을 당기는 방법
실을 당겼다고하자. 실을 끝까지 당기게되면 실의 맨처음이 나온다.
그렇지만... 펌웨어에서 실을 당기는 방법은..?

# 2) 처음 실의 끝에서 나타나는 패턴을 확인해본다.
실의 맨 처음으로 갈수록 실타래가 풀려있는 경우가 있음..
이 실타래의 맨 처음을 확인하기 위해서는 이러한 실타래가 풀려있는 특정 지점을 확인하는것..
근데... 이 지점을 확인하기 위해선 눈으로 일일히 해당 지점이 풀렸는지 안풀렸는지를 확인해야하므로 오버헤드가 많이걸림
-> Determining MIPS base address 논문 (디지게 느림)
=> 2번의 방법에서 스코프만 조금 줄이면 가능할 것 같은데..?


## 개선책
해당 부트로더가 올라올 경우, 반드시 나타나는 패턴이 있을것

### 사실관계만 확인해볼까?
펌웨어 부팅되기 위해선 반드시 압축되지 않은 RAW 데이터 영역을 필요로함.
이러한 RAW 데이터 영역 확인을 통해 해당 펌웨어를 로드하는 베이스 주소를 추정할 수 있을듯


베이스 주소를 찾는 방법에 대한.. 사이트들?
- https://www.praetorian.com/blog/reversing-and-exploiting-embedded-devices-part-1-the-software-stack/
- https://reverseengineering.stackexchange.com/questions/16612/is-there-a-method-for-guessing-the-addresses-for-unknown-areas-in-bare-metal-f