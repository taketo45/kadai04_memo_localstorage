'use strict';
const isDebug = true;
const mh = new MemoHandler(isDebug);

//0.初期化処理・リフレッシュ処理
EL.$window.on('load',()=>{
  mh.refreshHtml();
});

//1.Save クリックイベント
EL.$new.on("click",function(){
  mh.newRecord();
});

//1.Save クリックイベント
EL.$save.on("click",function(){
  mh.saveRefreshMemo();
});

//2.clear クリックイベント
EL.$clear.on("click",function(){
  mh.allClearDisplay();
});

//4.単発行のclear クリックイベント
EL.$document.on('click', '.clearbtn', function() {
    mh.oneRowClear($(this));
});

//5.一覧の特定行をクリックしたらタイトルメモ欄に詳細を表示
mh.documentDisplay();

//6. キーダウンイベントで自動保存
mh.keyDownControl(EL.$title);
mh.keyDownControl(EL.$memo);

//7.Enterキーでフォーカス移動、Shift+Enterキーでフォーカス戻る
enterFocusContol(EL.elements);

function enterFocusContol(el){
  $(el).keypress(function(e) {
    let c = e.which ? e.which : e.keyCode;
    if (c == 13) { 
      let index = $(el).index(this);
      let criteria = e.shiftKey ? ":lt(" + index + "):last" : ":gt(" + index + "):first";
      $(el + criteria).focus();
      e.preventDefault();
    }
  });
}
