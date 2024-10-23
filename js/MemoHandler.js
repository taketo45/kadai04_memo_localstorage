'use strict';
class MemoHandler {
  isDebug;
  ls;
  constructor(isDebug=false){
    this.isDebug = isDebug;
    this.ls = new LocalStorageManager(this.isDebug);
  }

  saveRefreshMemo(){
    const key = EL.$key.val(); 
    const value = EL.$memo.val();
    this.ls.set(key,value);
    if(this.isDebug){
      console.log(this.constructor.name + ' > refreshHtml() key:'+ key + ' value:' + value);
    }
    this.refreshHtml();
  }

  refreshHtml() {
    //3.ページ読み込み：保存データ取得表示
    EL.$list.empty();
    for(let i=0; i<localStorage.length;i++){
        const key = this.ls.getByIndex(i);
        const value = this.ls.getByKeyName(key);
        const btnhtml = '<button id="'+ key +'" class="clearbtn">削除</button>';
        const html = '<tr><td>'+ key +'</td><td>'+ value +'</td><td>'+ btnhtml +'</td></tr>';
        
        EL.$list.append(html);
        
    }
    const curentKey = EL.$key.val(); 
    const curentValue = EL.$memo.val();
    if(this.isDebug){
      console.log(this.constructor.name + ' > refreshHtml() key:'+ curentKey + ' value:' + curentValue);
    }
    EL.$key.val(curentKey); 
    EL.$memo.val(curentValue);
  }

  oneRowClear($element){
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
      let value = "";
      if(index>=0){
        selectKey = EL.$list.children().eq(index).children().eq(0).text();
        console.log('selectKey is '+ selectKey);
      }
      
      value = self.ls.getByKeyName(selectKey);

      if(this.isDebug){
        console.log(this.constructor.name + ' > documentDisplay() index:'+ index + ' selectKey:' + selectKey + ' value:' + value);
      }
      EL.$key.val(selectKey); 
      EL.$memo.val(value);
    });
  }

  keyDownControl($el){
  
    $el.keydown((e)=>{
      const keyHandlers = {
        [KEYS.Enter]: () => this.saveRefreshMemo(),
        // [KEYS.BS]: () => this.saveRefreshMemo(),
        [KEYS.Tab]: () => this.saveRefreshMemo(),
        [KEYS.Space]: () => this.saveRefreshMemo(),
        [KEYS.Esc]: () => this.saveRefreshMemo(),
      }
      if(this.isDebug){
        console.log(this.constructor.name + ' > keyDownControl() keyCode:'+ e.keyCode);
      }
      const hadler = keyHandlers[e.keyCode];
      if(hadler) hadler(); 
    });
  }

  allClearDisplay(){
    this.ls.allClear();
    EL.$list.empty(); //remove()は#list自体を削除してしまう。違いに注意！
    EL.$key.val(""); 
    EL.$memo.val("");
    if(this.isDebug){
      console.log(this.constructor.name + ' > allClearDisplay() ls.allClear() EL.$list.empty()');
    }
  }

}

