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
    // 対象テーブルを取得
    var myTable = document.getElementById("hogeTable");
    // ドロップダウンリスト作成
    createProjDropDownList(myTable);

    //総合計行インデックス取得
    // var grandTotalRowIndex = myTable.rows.length;

//     var listItemArr = getListItem(table,"プロジェクト名");
//     for(var i=0;i < listItemArr.length - 1;i++){
//         // プロジェクト別合計行を追加
//         addTotalRow(myTable,listItemArr[i],i);
//     }
}

function createProjDropDownList(table){
    // ・ドロップダウン用の値の取得
    var listItemArr = getListItem(table,"プロジェクト名");

    // ・ドロップダウンコントロールの生成
    createDropDown("projList",listItemArr);

    // ・ドロップダウンの位置調整。

}

// リストアイテム取得　引数：テーブル、リスト化したい対象のカラム名
function getListItem(table,targetListItemName){

    var listItemArr=[];
    var targetListItemIndex = 0;

    targetListItemIndex = getTargetColIndex(table,targetListItemName);

    var itemName = "";
    listItemArr.push("選択してください。");
    // ドロップダウンリストの項目を取得
    for (var i = 1; i < table.rows.length-1; i++) {

        // テーブルからドロップダウンリストの値を取得
        itemName = table.rows[i].cells[targetListItemIndex].innerHTML;

        // ドロップダウンリストの取得した値がなければ、リストに追加
        // if(listItemArr.indexOf(itemName) !== -1){
        if(listItemArr.includes(itemName) === false){
            listItemArr.push(itemName);
        }
    }

    // ドロップダウンリストの値を返す
    return listItemArr;
}

// 対象カラムの位置を特定　引数：テーブル、位置を特定したいカラム名
function getTargetColIndex(table,targetColName){
    var targetItemIndex = 0;
    // カラムの位置を特定
    for(var i=0;i< table.rows[0].cells.length;i++){
        if(table.rows[0].cells[i].innerHTML === targetColName){
            targetItemIndex = i;
            break;
        }
    }
    return targetItemIndex;
}

// ドロップダウンリスト作成
function createDropDown(itemId,ItemArr){
    var bodyElement = document.getElementsByTagName('body');
    var selectList = document.createElement('select');
    selectList.setAttribute("id",itemId);
    
    for(i = 0;i < ItemArr.length;i++){

        //ドロップダウンのText,Valueを設定
        var selItem = document.createElement('option');
        selItem.text=ItemArr[i];
        selItem.value=i;
        selectList.appendChild(selItem);
    }

    bodyElement[0].appendChild(selectList);

}

// function dropDownChanged(table,selectProjName){
//     // ・選択されたプロジェクト行のみ表示、それ以外の行を非表示にする。
//     displayRowChange(table,selectProjName);
//     // ・表示行の作業時間を合計行に設定する。

//     // ・その他のプロジェクトの合計行を消す。
// }

// function displayRowChange(table,selectProjName){
//     // 今は総合計行も表示、非表示が切り替わる。

//     // プロジェクト名のカラム位置取得
//     var projNameIndex = getTargetColIndex(table,"プロジェクト名");

//     // テーブル要素のrowでループ
//     for(var i = 1;i < table.rows.length;i++){

//         // 選択されたプロジェクトの場合
//         if(selectProjName === table.row[i].cells[projNameIndex].innerHTML){

//             // 行を表示。
//             table.row[i].style.display = "block";

//         }else if(selectProjName === "選択してください。"){
//             // 行を表示。
//             table.row[i].style.display = "block";
//         }else{

//             // 上記以外の場合
//             // 行を非表示。
//             table.row[i].style.display = "none";
//         }
//     }
// }



// function addTotalRow(table,targetProjName,idNo){
    
//     var totalWorkingHours = 0;
//     var tr = document.createElement("tr");
//     // tr.setAttribute("id","TotalRow" + i );
//     // 取得した合計時間を合計行に設定
//     createTotalRow(tr,totalWorkingHours,targetProjName);
//     table.appendChild(tr);
// }

// 合計行作成
// function createTotalRow(tr,totalWorkingHours,targetProjName){

//     var td = document.createElement("td");
//     tr.appendChild(td);

//     // 作業時間表示列
//     var td2 = document.createElement("td");
//     var label = document.createElement("span");
//     label.innerHTML = totalWorkingHours;
//     td2.appendChild(label);
//     tr.appendChild(td2);

//     // プロジェクト名表示列
//     var td3 = document.createElement("td");
//     var label2 = document.createElement("span");
//     label2.innerHTML = targetProjName;
//     td3.appendChild(label2);
//     tr.appendChild(td3);
// }



// // 合計時間取得　引数：テーブル、集計対象項目名、対象プロジェクト名
// function getTotalWorkinghours(table,sumTargetColName,targetProjName){

//     var sumTargetColIndex = 0;
//     var sumTargetKeyIndex = 0;
//     sumTargetColIndex = getTargetColIndex(table,sumTargetColName);
//     sumTargetKeyIndex = getTargetColIndex(table,"プロジェクト名");

//     var hours = 0;
//     var minuets = 0;

//     var tmpHours = 0;
//     var tmpMinuets = 0;

//     for (var n=1; n < table.rows.length-2; n++) {

//         // 集計対象の行の場合
//         if(table.rows[n].cells[sumTargetKeyIndex].innerHTML === targetProjName){

//             // hh:mmを分解
//             var tmpHHmm = table.rows[n].cells[sumTargetColIndex].innerHTML.split(':');
            
//             // 合計時間算出
//             tmpHours = tmpHours + Number(tmpHHmm[0]);
            
//             // 合計分を算出
//             tmpMinuets = tmpMinuets + Number(tmpHHmm[1]) ;

//         }  
//     }

//     // 合計時間＝合計時間+合計分数（時間分）
//     hours = tmpHours + tmpMinuets / 60;

//     // 集計した、分を設定
//     minuets = tmpMinuets % 60;

//     return hours + ':' + minuets;
// }



// // 隠し項目設定　引数：Name属性に設定したい文字列、そのNameに属する、値（複数可）
// function setHiddenItem(itemName,ItemArr){

//     var bodyElement = document.getElementsByTagName('body');

//     for(i = 0;i < ItemArr.length;i++){
//         var hiddenItem = document.createElement("input");
        
//         hiddenItem.setAttribute("type","hidden");
//         hiddenItem.setAttribute("name",itemName);
//         hiddenItem.setAttribute("value",ItemArr[i]);

//         bodyElement.appendChild(hiddenItem);

//     }
// }



