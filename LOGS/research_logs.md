# Research Logs
## `21.02.22.(월)
- 목표 : 주어진 실의 맨처음 시작점 찾기
나에게 모두 깜깜한 방에 실타래가 중간부터 주어졌다고 하자 이 실의 맨 처음을 확인하는 방법은 무엇일까?
- 1) 실을 당긴다.
- 2) 처음 실의 끝에서 나타나는 패턴을 확인해본다.

### 1) 실을 당기는 방법
실을 당겼다고하자. 실을 끝까지 당기게되면 실의 맨처음이 나온다.
그렇지만... 펌웨어에서 실을 당기는 방법은..?

### 2) 처음 실의 끝에서 나타나는 패턴을 확인해본다.
실의 맨 처음으로 갈수록 실타래가 풀려있는 경우가 있음..
이 실타래의 맨 처음을 확인하기 위해서는 이러한 실타래가 풀려있는 특정 지점을 확인하는것..
근데... 이 지점을 확인하기 위해선 눈으로 일일히 해당 지점이 풀렸는지 안풀렸는지를 확인해야하므로 오버헤드가 많이걸림
-> Determining MIPS base address 논문 (디지게 느림)
=> 2번의 방법에서 스코프만 조금 줄이면 가능할 것 같은데..?


### 개선책
해당 부트로더가 올라올 경우, 반드시 나타나는 패턴이 있을것

### 사실관계만 확인해볼까?
펌웨어 부팅되기 위해선 반드시 압축되지 않은 RAW 데이터 영역을 필요로함.
이러한 RAW 데이터 영역 확인을 통해 해당 펌웨어를 로드하는 베이스 주소를 추정할 수 있을듯


베이스 주소를 찾는 방법에 대한.. 사이트들?
- https://www.praetorian.com/blog/reversing-and-exploiting-embedded-devices-part-1-the-software-stack/
- https://reverseengineering.stackexchange.com/questions/16612/is-there-a-method-for-guessing-the-addresses-for-unknown-areas-in-bare-metal-f


## `21.02.23.(화)
일반적인 펌웨어의 부팅 시퀀스
1. 전원인가
2. 부트로더 적재 후 실행            <- 이 과정 내에 베이스 주소가 존재
3. 롬 내용을 램에 적재(커널 적재)
4. 부트 시퀀스 돌입
5. 데몬 및 프로세스 실행
6. 기기동작

부트로더의 역할
이미지를 롬에서 램으로 옮겨주는 역할
https://reverseengineering.stackexchange.com/questions/11096/reverse-engineering-mips-bootloader


그렇다면
- 코드와 데이터를 나누고
- 코드의 영역에서 BSS 영역으로 가는 코드를 찾고
- 그 코드의 상위에 존재하는 주소 값들을 모두 뽑아서
- 해당 코드와의 매칭 여부를 확인한다..?


## `21.02.24 (수)
BSS 영역의 존재이유 = Zero-fill-on-demand 기법을 위해 해당 영역을 유지
=> 이렇게 해줌으로써 얻는 이득..?

- Zero-fill-On-Demand
fork()시, Copy-On-Write(COW)가 일어남. 이 경우, 복사되는 데이터를 그대로 유지하고 있다가 해당 내용에 변경점이 있는 경우에만 메모리로 복사
이렇게함으로써 Overhead가 많이 걸리는 메모리 Write 작업의 Resource를 아낄 수가 있다는 장점이 존재

복사될때, Allocation되는 페이지를 0으로 초기화
=> 복사될 영역의 물리 메모리를 0으로 초기화 해준다는 의미
=> 보안문제 향상 <아니 그렇다고 사이클을 태워..?>

/dev/null이 이 친구이구먼.. (/dev/zero)
=> 역사를 알아야 되는 이유.. 해당 역사가 이루어진건 어떤 목적과 이유가 있어서였으며, 이를 통해 해결책을 배울 수가 있다.


 Zero-fill-on-demand를 유지함으로써 해당 영역에 대한 보안성 유지..?
 => ??? 멍게소리
 => 그게 아니라 보안은 부수적인 이유고, BSS 영역의 메모리를 0으로 유지함으로써 static memory의 이전 데이터에 접근하지 못하게 하여, 같은 프로세스를 동작시키더라도 static memory에 의한 오동작을 방지할 수 있음.
 => 추가적으로 해당 데이터가 없는 상태에서 프로그램을 하기 위해서 데이터 영역을 쓰는 것은 낭비
    해당 영역을 0으로 초기화된 곳을 지정함으로써 데이터 영역에 대한 전체 크기를 줄일 수 있음

- 참고할만한 사이트
1) https://shinluckyarchive.tistory.com/159
2) https://donghwada.tistory.com/entry/%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%98%81%EC%97%AD-Code-Data-BSS-HEAP-Stack-Little-Endian-Stack%EC%9D%98-%EC%9D%B4%ED%95%B4
3) https://kldp.org/node/122255

해야할일..
bss 영역.. 도대체 이놈이 필요한 이유..? 왜 스택의 시작위치를 정한다는걸까..?


## `21.02.25 (목)
Linux 부팅할때 압축된 커널 zImage의 압축을 해제하는데 이 과정에서 BSS 영역 초기화를 수행..?
=> 왜?

부팅과정
=> 부팅과정에서 사용하는 것은 압축.. 압축한 뒤, 해당 내용 중 .o파일만 뽑아 vmlinux 파일을 만듬
링크 : http://www.iamroot.org/xe/index.php?mid=Kernel&document_srl=24595

## `21.02.26 (금)
