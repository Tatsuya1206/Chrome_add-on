//合計行の始まりと、終わりの行数を取得する。
//合計行の表示、非表示を実装する。

const PROJ_COL_NAME = "プロジェクト";
const WORKING_HOURS_COL_NAME = "実働";
const SEL_LIST_DEFAULT_ITEM = "選択してください。";
const PROJ_LIST_ID = "projList";

//let で合計行の始まりと、終わりの行数取得

window.onload = function(){
    // 対象テーブルを取得
    var myTable = document.getElementsByTagName('table')[0];
    // ドロップダウンリスト作成
    createProjDropDownList(myTable);
    //ここで、合計行の始まりを取得
    //総合計行インデックス取得
    // var grandTotalRowIndex = myTable.rows.length;

    var listItemArr = getListItem(myTable,PROJ_COL_NAME);
    for(var i = 2;i < listItemArr.length;i++){
        // プロジェクト別合計行を追加
        addTotalRow(myTable,listItemArr[i],i);
    }
    //ここで、合計行の最後の行数を取得
}

function createProjDropDownList(table){
    // ・ドロップダウン用の値の取得
    var listItemArr = getListItem(table,PROJ_COL_NAME);

    // ・ドロップダウンコントロールの生成
    createDropDown(PROJ_LIST_ID,listItemArr,table);

}

// リストアイテム取得　引数：テーブル、リスト化したい対象のカラム名
function getListItem(table,targetListItemName){

    var listItemArr=[];
    var targetListItemIndex = 0;

    targetListItemIndex = getTargetColIndex(table,targetListItemName);

    var itemName = "";
    listItemArr.push(SEL_LIST_DEFAULT_ITEM);
    // ドロップダウンリストの項目を取得
    for (var i = 2; i < table.rows.length-1; i++) {

        // テーブルからドロップダウンリストの値を取得
        itemName = table.rows[i].cells[targetListItemIndex].innerHTML;

        // ドロップダウンリストの取得した値がなければ、リストに追加
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
    for(var i=0;i< table.rows[1].cells.length;i++){
        if(table.rows[1].cells[i].innerHTML === targetColName){
            targetItemIndex = i;
            break;
        }
    }
    return targetItemIndex;
}

// ドロップダウンリスト作成
function createDropDown(itemId,ItemArr,table){
    var tr = table.rows[0];
    var td = document.createElement('td');
    var selectList = document.createElement('select');
    selectList.setAttribute("id",itemId);
    selectList.addEventListener('change', dropDownChanged);
    
    for(i = 0;i < ItemArr.length;i++){

        //ドロップダウンのText,Valueを設定
        var selItem = document.createElement('option');
        selItem.text=ItemArr[i];
        selItem.value=i;
        selectList.appendChild(selItem);
    }

    td.appendChild(selectList);
    tr.appendChild(td);

}

function dropDownChanged(e) {
    var selectList = document.getElementById(PROJ_LIST_ID);
    let index = Number(e.target.value);
    let text = selectList.options[index].text
    var table = document.getElementsByTagName("table")[0];
    displayRowChange(table,text);
}


function displayRowChange(table,selectProjName){
    // 今は総合計行も表示、非表示が切り替わる。

    // プロジェクト名のカラム位置取得
    var projNameIndex = getTargetColIndex(table,PROJ_COL_NAME);

    // テーブル要素のrowでループ
    for(var i = 2;i < table.rows.length;i++){

        // 選択されたプロジェクトの場合
        if(selectProjName === table.rows[i].cells[projNameIndex].innerHTML){

            // 行を表示。
            table.rows[i].style.display = "table-row";

        }else if(selectProjName === SEL_LIST_DEFAULT_ITEM){
            // 行を表示。
            table.rows[i].style.display = "table-row";
        }else{

            // 上記以外の場合
            // 行を非表示。
            table.rows[i].style.display = "none";
        }
    }
}


// 合計行追加
function addTotalRow(table,targetProjName,totalRowIndex){
    
    var totalWorkingHours = 0;
    var tr = document.createElement("tr");
    // tr.setAttribute("id","TotalRow" + i );
    totalWorkingHours = getTotalWorkinghours(table,WORKING_HOURS_COL_NAME,targetProjName,totalRowIndex);
    // 取得した合計時間を合計行に設定
    createTotalRow(tr,totalWorkingHours,targetProjName);
    table.appendChild(tr);
}

// 合計行作成
function createTotalRow(tr,totalWorkingHours,targetProjName){

    var td = document.createElement("td");
    td.setAttribute("colspan","5");
    tr.appendChild(td);

    // 作業時間表示列
    var td2 = document.createElement("td");
    var label = document.createElement("span");
    label.innerHTML = totalWorkingHours;
    td2.appendChild(label);
    tr.appendChild(td2);

    // プロジェクト名表示列
    var td3 = document.createElement("td");
    td3.innerHTML = targetProjName
    tr.appendChild(td3);

    var td4 = document.createElement("td");
    tr.appendChild(td4);
    var td5 = document.createElement("td");
    tr.appendChild(td5);
}

// 合計時間取得　引数：テーブル、集計対象項目名、対象プロジェクト名
function getTotalWorkinghours(table,sumTargetColName,targetProjName,totalRowIndex){

    var sumTargetColIndex = 0;
    var sumTargetKeyIndex = 0;
    sumTargetColIndex = getTargetColIndex(table,sumTargetColName);
    sumTargetKeyIndex = getTargetColIndex(table,PROJ_COL_NAME);

    var tmpHours = 0;
    var tmpMinuets = 0;

    var hours = "";
    var minuets = "";

    var tmpFullSecond = 0;

    for (var n=2; n < table.rows.length - totalRowIndex; n++) {

        // 集計対象の行の場合
        if(table.rows[n].cells[sumTargetKeyIndex].innerHTML === targetProjName){

            // hh:mmを分解
            var tmpHHmm = table.rows[n].cells[sumTargetColIndex].innerHTML.split(':');
            
            // 合計秒算出
            tmpFullSecond = tmpFullSecond + Number(tmpHHmm[0]) * 60 * 60 + Number(tmpHHmm[1]) * 60;
        }  
    }

    tmpHours = Math.floor(Math.abs(tmpFullSecond) / 3600);
    tmpMinuets = Math.floor(Math.abs(tmpFullSecond) % 3600 / 60);

    hours = timeFormat(String(tmpHours));
    minuets = timeFormat(String(tmpMinuets));

    return hours + ':' + minuets;
}

function timeFormat(arg){
    if(arg.length < 2){
        arg = "0" + arg;
        
    }
    return arg;
}


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



