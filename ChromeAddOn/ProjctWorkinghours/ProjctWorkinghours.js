const PROJ_COL_NAME = "プロジェクト";
const WORKING_HOURS_COL_NAME = "実働";
const SEL_LIST_DEFAULT_ITEM = "選択してください。";
const PROJ_LIST_ID = "projList";
const TOTAL_ROWS_COLSPAN = 5;

window.onload = function(){
    // 対象テーブルを取得
    var myTable = document.getElementsByTagName('table')[0];
    // ドロップダウンリスト作成
    createProjDropDownList(myTable);

    //合計行の最初の行数を取得
    var totalStartRowIndex = myTable.rows.length + 1;
    setHiddenItem('totalStartRowIndex',totalStartRowIndex);

    var listItemArr = getListItem(myTable,PROJ_COL_NAME);
    for(var i = 1;i < listItemArr.length;i++){
        // プロジェクト別合計行を追加
        addTotalRow(myTable,listItemArr[i],i);
    }
    //合計行の最後の行数を取得
    var totalEndRowIndex = myTable.rows.length;
    setHiddenItem('totalEndRowIndex',totalEndRowIndex);
}

// ドロップダウン作成
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
        var selItem = document.createElement('option');
        selItem.text=ItemArr[i];
        selItem.value=i;
        selectList.appendChild(selItem);
    }
    td.appendChild(selectList);
    tr.appendChild(td);
}

// ドロップダウンインデックスチェンジ
function dropDownChanged(e) {
    var selectList = document.getElementById(PROJ_LIST_ID);
    var totalStartRowIndex = Number(document.getElementById("totalStartRowIndex").value);
    var totalEndRowIndex = Number(document.getElementById("totalEndRowIndex").value);
    let index = Number(e.target.value);
    let text = selectList.options[index].text
    var table = document.getElementsByTagName("table")[0];
    displayRowChange(table,text,totalStartRowIndex);
    displayTotalRowChange(table,text,totalStartRowIndex,totalEndRowIndex)
}

// テーブル行の表示非表示制御
function displayRowChange(table,selectProjName,totalStartRowIndex){
    var projNameIndex = getTargetColIndex(table,PROJ_COL_NAME);

    for(var i = 2;i < totalStartRowIndex - 2;i++){
        if(selectProjName === table.rows[i].cells[projNameIndex].innerHTML){
            changeShowHide(table.rows[i],true);
        }else if(selectProjName === SEL_LIST_DEFAULT_ITEM){
            changeShowHide(table.rows[i],true);
        }else{
            changeShowHide(table.rows[i],false);
        }
    }
}

// テーブルの合計行の表示非表示制御
function displayTotalRowChange(table,selectProjName,totalStartRowIndex,totalEndRowIndex){
    var projNameIndex = getTargetColIndex(table,PROJ_COL_NAME);

    for(var i = totalStartRowIndex - 1; i < totalEndRowIndex;i++){
        if(selectProjName === table.rows[i].cells[(projNameIndex - TOTAL_ROWS_COLSPAN) + 1].innerHTML){
            changeShowHide(table.rows[i],true);
        }else if(selectProjName === SEL_LIST_DEFAULT_ITEM){
            changeShowHide(table.rows[i],true);
        }else{
            changeShowHide(table.rows[i],false);
        }
    }
}

// テーブルの行の非表示/非表示
function changeShowHide(tr,isShow){
    if(isShow){
        tr.style.display = "table-row";
    }else{
        tr.style.display = "none";
    }
}

// 合計行追加
function addTotalRow(table,targetProjName,totalRowIndex){
    var totalWorkingHours = 0;
    var tr = document.createElement("tr");
    totalWorkingHours = getTotalWorkinghours(table,WORKING_HOURS_COL_NAME,targetProjName,totalRowIndex);
    createTotalRow(tr,totalWorkingHours,targetProjName);
    table.appendChild(tr);
}

// 合計行作成
function createTotalRow(tr,totalWorkingHours,targetProjName){
    var td = document.createElement("td");
    td.setAttribute("colspan",String(TOTAL_ROWS_COLSPAN));
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

    //td調整
    var td4 = document.createElement("td");
    tr.appendChild(td4);
    var td5 = document.createElement("td");
    tr.appendChild(td5);
}

// 合計時間取得
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

// 時間表示フォーマット
function timeFormat(arg){
    if(arg.length < 2){
        arg = "0" + arg;
    }
    return arg;
}

// 隠し項目設定
function setHiddenItem(id,value){
    var hiddenItem = document.createElement("input");
    hiddenItem.setAttribute("type","hidden");
    hiddenItem.setAttribute("id",id);
    hiddenItem.setAttribute("value",value);
    document.body.appendChild(hiddenItem);
}
