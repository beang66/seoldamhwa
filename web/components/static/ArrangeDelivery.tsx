export default function ArrangeDelivery() {
  return (
    <div className="deliv">
      <img className="deliv-diagram" src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/img/seoldamhwa-package.svg`} alt="천으로 꽃다발을 감싸고 주름진 입구를 끈으로 여민 복주머니 패키지" width={300} height={330} />
      <table><tbody>
        <tr><th scope="row">포장</th><td>복주머니 형태의 설담화 패키지에 담아 전합니다.</td></tr>
        <tr><th scope="row">작업실 픽업</th><td>원하는 날 오후 1시~6시. 꽃꽂이는 주문 다음 날부터 받으실 수 있어요.</td></tr>
        <tr><th scope="row">서울 당일 퀵</th><td>오후 2시까지 주문하면 그날 저녁에 도착해요. 화기가 흔들리지 않게 상자에 고정해 보냅니다.</td></tr>
        <tr><th scope="row">택배</th><td>꽃과 화기가 상할 수 있어 꽃꽂이는 택배로 보내지 않아요.</td></tr>
      </tbody></table>
    </div>
  );
}
