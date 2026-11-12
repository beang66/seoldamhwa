import Link from 'next/link';

export default function HomeBojagi() {
  return (
    <>
<section className="bojagi paper">
    <div className="draw rv">
      <svg viewBox="0 0 520 560" role="img" aria-label="보자기로 싼 꽃 선물 연필 그림">
        <g fill="none" stroke="#3b3a37" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          
          <path d="M262 309.5 C258 236 246 170 214 112" />
          <path d="M268 309 C272 240 292 176 330 128" />
          <path d="M265 309 C266 244 262 196 270 150" />
          <path d="M258 310.5 C238 254 206 222 168 206" />
          
          <path d="M240 196 C222 186 206 186 192 196 C206 204 224 204 240 196 Z" />
          <path d="M300 190 C318 176 336 174 352 182 C338 194 318 196 300 190 Z" />
          <path d="M266 230 C254 214 252 200 258 188 C268 202 270 216 266 230 Z" />
          <path d="M214 228 C200 230 188 240 182 252 C196 250 208 242 214 228 Z" />
          
          <path d="M214 112 C200 104 196 88 206 80 C214 74 222 82 222 92 C226 80 240 78 244 88 C248 98 236 108 224 110 C234 116 236 130 226 134 C216 138 210 126 214 112 Z" />
          <circle cx="220" cy="100" r="3" />
          
          <circle cx="330" cy="118" r="8" /><circle cx="342" cy="126" r="8" /><circle cx="338" cy="140" r="8" /><circle cx="323" cy="140" r="8" /><circle cx="318" cy="126" r="8" />
          <circle cx="330" cy="131" r="2.5" />
          
          <path d="M270 150 C264 140 266 128 272 122 C278 130 278 142 270 150 Z" />
          <path d="M168 206 C158 200 156 190 162 184 C170 188 172 198 168 206 Z" />
          
          <path d="M248 318 C222 290 196 268 176 272 C160 276 166 300 190 310 C208 318 230 322 248 324" />
          <path d="M286 318 C312 290 340 270 358 276 C372 282 364 304 342 312 C324 318 304 322 286 324" />
          <path d="M190 292 C204 296 222 304 236 314" opacity=".6" />
          <path d="M344 294 C330 298 312 306 298 316" opacity=".6" />
          
          <path d="M246 316 C252 306 282 306 288 316 C294 330 282 340 268 340 C252 340 240 330 246 316 Z" />
          <path d="M256 322 C262 318 274 318 280 324" opacity=".6" />
          
          <path d="M248 334 C210 340 170 352 146 372 C118 398 110 444 120 480 C126 502 146 512 172 514 L364 514 C390 512 410 500 414 476 C422 438 412 396 384 372 C360 352 324 340 290 334" />
          
          <path d="M146 372 C128 404 124 436 132 470" opacity=".7" />
          <path d="M384 372 C402 404 406 436 400 470" opacity=".7" />
          <path d="M210 346 C200 392 198 448 206 512" opacity=".55" />
          <path d="M324 346 C336 392 338 448 332 512" opacity=".55" />
          <path d="M268 342 C266 400 266 460 268 512" opacity=".35" />
          
          <path d="M96 520 C180 526 360 526 440 520" opacity=".5" />
        </g>
        
        <g stroke="#3b3a37" strokeWidth=".8" opacity=".45">
          <path d="M370 400 L392 380 M372 416 L400 390 M374 432 L404 404 M374 448 L406 418 M372 464 L406 432 M368 480 L404 446 M360 494 L400 460 M350 506 L392 472" />
          <path d="M140 450 L156 434 M138 466 L160 444 M142 480 L166 456 M150 492 L174 468" />
          <path d="M264 330 L274 322 M262 336 L280 324" />
        </g>
              
        <path d="M248 334 C210 340 170 352 146 372 M290 334 C324 340 360 352 384 372" fill="none" stroke="var(--blue)" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <div className="inset" aria-hidden="true"></div>
    </div>
    <div className="cols rv">
      <h2 className="title">다시 쓰는 보자기</h2>
      <span className="roman">dasi sseuneun bojagi</span>
      <p className="col" style={{'--dot': '22%'} as React.CSSProperties}><strong>꽃을 감싼 천은 버려지지 않습니다.</strong></p>
      <p className="col" style={{'--dot': '58%'} as React.CSSProperties}>쪽물과 감물로 들인 무명과 모시.<br />매듭을 풀면 손수건이 되고<br />식탁보가 되고, 다음 선물의 포장이 됩니다.</p>
      <p className="col sm" style={{'--dot': '34%'} as React.CSSProperties}>비닐과 플라스틱 리본 없이<br />천 한 장과 매듭 하나로 전합니다.</p>
      <p className="col sm" style={{'--dot': '70%'} as React.CSSProperties}>가방 끈을 걸면 주머니가 됩니다.<br />보자기만 따로 구매할 수 있습니다.</p>
      <Link className="cta" href="/shop?cat=bojagi">보자기 보기</Link>
    </div>
  </section>

  
    </>
  );
}
