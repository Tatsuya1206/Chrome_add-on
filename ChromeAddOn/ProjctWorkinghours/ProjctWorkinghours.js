// 読込時
    // プロジェクト明細取得
//     ドロップダウン生成イベント
//     プロジェクト別の作業時間合計を追加する
//         ドロップダウン選択時は選択されていないプロジェクトの合計が表示されてないようにする。


// ドロップダウン選択時
//     選択されたプロジェクトの行のみ、表示
//     その他は非表示
//     表示されている行の作業時間の合計を表示する。
window.onload = function(){

}


function createDropDownList(table){
    // 対象テーブルを取得
    var myTable = document.getElementById("hogeTable");

    // ・ドロップダウン用の値の取得
    var listItemArr = getListItem(table,"プロジェクト名");

    // ・ドロップダウンの値はHiddenに保持
    setHiddenItem("HiddenItems",listItemArr);

    // ・ドロップダウンコントロールの生成
    createDropDown("projList",listItemArr);

    // ・ドロップダウンの位置調整。

    // ドロップダウンの選択肢の分だけ、合計行を増やす
    for(var i=0;i < listItemArr.length;i++){
        let totalWorkingHours = 0;
        totalWorkingHours = getTotalWorkinghours(myTable,"作業時間","プロジェクト名")
    }

}

function dropDownChanged(){
    // ・選択されたプロジェクト行のみ表示、それ以外の行を非表示にする。
    // ・表示行の作業時間を合計行に設定する。
    // ・その他のプロジェクトの合計行を消す。
}

function getTotalArray(){
    // プロジェクト別合計取得

    var listItemArr = getListItem(table,itemName);


}

// 合計時間取得　引数：テーブル、集計対象項目名、集計キー対象名
function getTotalWorkinghours(table,sumTargetItemName,sumTargetKeyName){

    let targetListItemIndex = 0;
    targetListItemIndex = getTargetItemIndex(table,sumTargetItemName);
    sumTargetKeyIndex = getTargetItemIndex(table,sumTargetKeyName);
    let hours = 0;
    let minuets = 0;

    let tmpHours = 0;
    let tmpMinuets = 0;

    for (var n=1; n < table.rows.length-2; n++) {

        // 集計対象の行の場合
        if(table.rows[n].cells[sumTargetKeyIndex].innerHTML === sumTargetKeyName){

            // hh:mmを分解
            let tmpHHmm = table.rows[n].cells[targetListItemIndex].innerHTML.split(':');
            
            // 合計時間算出
            tmpHours = tmpHours + Number(tmpHHmm[0]);
            
            // 合計分を算出
            tmpMinuets = tmpMinuets + Number(tmpHHmm[1]) ;

        }  
    }

    // 合計時間＝合計時間+合計分数（時間分）
    hours = tmpHours + tmpMinuets / 60;

    // 集計した、分を設定
    minuets = tmpMinuets % 60;

    return hours + ':' + minuets;
}

function getListItem(table,targetListItemName){

    let listItemArr=[];
    let targetListItemIndex = 0;

    targetListItemIndex = getTargetItemIndex(table,targetListItemName);

    var itemName = "";
    listItemArr.push("選択してください。");
    // ドロップダウンリストの項目を取得
    for (var n=1; n < table.rows.length-2; n++) {

        テーブルからドロップダウンリストの値を取得
        itemName = mytable.rows[n].cells[targetListItemIndex].innerHTML;

        // ドロップダウンリストの取得した値がなければ、リストに追加
        if(listItemArr.indexOf(itemName) != -1){
            listItemArr.push(itemName);
        }
    }

    // ドロップダウンリストの値を返す
    return listItemArr;
}

function getTargetItemIndex(table,targetItemName){
    let targetItemIndex = 0;
    // カラムの位置を特定
    for(var i=0;i< table.rows[0].cells.length;i++){
        if(table.rows[0].cells[i].innerHTML === targetItemName){
            targetItemIndex = i;
            break;
        }
    }
    return targetItemIndex;
}

function setHiddenItem(itemName,ItemArr){

    let bodyElement = document.getElementsByTagName('body');

    for(i = 0;i < ItemArr.length;i++){
        let hiddenItem = document.createElement("input");
        
        hiddenItem.setAttribute("type","hidden");
        hiddenItem.setAttribute("name",itemName);
        hiddenItem.setAttribute("value",ItemArr[i]);

        bodyElement.appendChild(hiddenItem);

    }
}

function createDropDown(itemId,ItemArr){
    let bodyElement = document.getElementsByTagName('body');
    let selectList = document.createElement('select');
    selectList.setAttribute("id",itemId);

    for(i = 0;i < ItemArr.length;i++){

        //ドロップダウンのText,Valueを設定
        let selItem = document.createElement('option');
        selItem.text=ItemArr[i];
        selItem.value=i;
        selectList.appendChild(selItem);
    }

    bodyElement.appendChild(selectList);

}


