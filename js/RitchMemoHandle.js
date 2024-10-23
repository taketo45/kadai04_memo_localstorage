'use strict';
class MemoHandler {
  isDebug;
  ls;
  isArray;
  date;
  constructor(isDebug=false){
    this.isDebug = isDebug;
    this.ls = new LocalStorageManager(this.isDebug);
    this.isArray = true;
    this.date = new Date();
  }

  saveRefreshMemo(){
    let key = EL.$key.val(); 
    const title = EL.$title.val();
    const memo = EL.$memo.val();
    const array = [title,memo];
    if(key===""){
      key = this.date.getTime();
    }
    this.ls.set(key,array,this.isArray);
    if(this.isDebug){
      console.log(this.constructor.name + ' > refreshHtml() key:'+ key + ' value:' + memo);
    }
    this.refreshHtml();
  }

  refreshHtml() {
    //3.ページ読み込み：保存データ取得表示
    EL.$list.empty();
    const array = [];
    for(let i=0; i<localStorage.length;i++){
      array[i] = this.ls.getByIndex(i);
    }

    array.sort((a,b)=>{
      return a-b;
    });

    for(let i=0; i<array.length;i++){
        const key = array[i];
        const arr = this.ls.getByKeyName(key,this.isArray);
        let title = arr[0];
        let memo = arr[1];
        const btnhtml = '<button id="'+ key +'" class="clearbtn">削除</button>';
        const html = '<tr><td>'+ key +'</td><td>'+ title +'</td><td>'+ memo +'</td><td>'+ btnhtml +'</td></tr>';
        EL.$list.append(html);
    }
    const curentKey = EL.$key.val(); 
    const curentTitle = EL.$title.val();
    const curentValue = EL.$memo.val();
    if(this.isDebug){
      console.log(this.constructor.name + ' > refreshHtml() key:'+ curentKey + ' title:' + curentTitle + ' memo:' + curentValue);
    }
    EL.$key.val(curentKey); 
    EL.$title.val(curentTitle);
    EL.$memo.val(curentValue);
  }

  oneRowClear($element){
    // EL.$key.val(curentKey); 
    const row = $element.closest("tr").remove();
    const key = $element.attr('id');
    if(this.isDebug){
      console.log(this.constructor.name + ' > oneRowClear() row:'+ row + ' key:' + key);
    }
    this.ls.deleteItem(key);
    $(row).remove(); 
    this.refreshHtml();
  }

  documentDisplay(){
    const self = this;
    EL.$document.on('click','tr',function(){
      const index = $(this).index('tr');
      // console.log('index is '+index);
      let selectKey ="";
      if(index>=0){
        selectKey = EL.$list.children().eq(index).children().eq(0).text();
        console.log('selectKey is '+ selectKey);
      }
      // console.log(self.ls.getByKeyName(selectKey,this.isArray));
      const array = self.ls.getByKeyName(selectKey,true);
      const title = array[0];
      const memo = array[1];
      if(this.isDebug){
        console.log(this.constructor.name + ' > documentDisplay() index:'+ index + ' selectKey:' + selectKey + ' title:' + title + ' value:' + memo);
      }
      EL.$key.val(selectKey); 
      EL.$title.val(title);
      EL.$memo.val(memo);
    });
  }

  keyDownControl($el){
  
    $el.keydown((e)=>{
      // alert(e.keyCode);
      this.saveRefreshMemo();
      const keyHandlers = {
      //   [KEYS.Enter]: () => this.saveRefreshMemo(),
      //   // [KEYS.BS]: () => this.saveRefreshMemo(),
        // [KEYS.Tab]: () => this.newRecord(),
        [KEYS.Cmd]: () => this.newRecord(),
      //   [KEYS.Space]: () => this.saveRefreshMemo(),
      //   [KEYS.Esc]: () => this.saveRefreshMemo(),
      }
      if(this.isDebug){
        console.log(this.constructor.name + ' > keyDownControl() keyCode:'+ e.keyCode);
      }
      const hadler = keyHandlers[e.keyCode];
      if(hadler) hadler(); 
    });
  }

  newRecord(){
    this.date = new Date();
    EL.$key.val(this.date.getTime()); 
    EL.$title.val("");
    EL.$memo.val("");
  }

  allClearDisplay(){
    this.ls.allClear();
    EL.$list.empty(); //remove()は#list自体を削除してしまう。違いに注意！
    EL.$key.val(""); 
    EL.$title.val("");
    EL.$memo.val("");
    if(this.isDebug){
      console.log(this.constructor.name + ' > allClearDisplay() ls.allClear() EL.$list.empty()');
    }
  }

}

