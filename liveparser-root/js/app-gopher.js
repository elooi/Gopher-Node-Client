//------------------------------------------------------------------------------
//GopherB Helpers
//------------------------------------------------------------------------------

var GopherCallerIDCouter = 100;
var GopherCallerID = '0:0';
var _$v = [];
var _$gX = 1000; //gopher scope tracker
var _$gXLocal = _$gX;

var DebugLines = 0;
var MaxDebugLines = 1000;

//------------------------------------------------------------------------------
GopherFunctionCall = function(xCodeLine, xFuncTrackID, xFuncStr, xFuncValue, xParentID, xGopherCallerID) {
    return xFuncValue;

}

function censor(censor) {
    var i = 0;

    return function(key, value) {
        if (i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
            return '[Circular]';

        if (i >= 4) // seems to be a harded maximum of 30 serialized objects?
            return '[Unknown]';

        ++i; // so we know we aren't using the original object anymore

        return value;
    }
}

//------------------------------------------------------------------------------------------------------------------------------
var ESQ = function(inStr) {
    var outStr = String(inStr).replace(/\'/g, "\\'");
    outStr = String(outStr).replace(/\"/g, '\\"');
    outStr = outStr.replace(/(?:\r\n|\r|\n)/g, '\\n');

    return outStr;
}

//------------------------------------------------------------------------------
_$fs = function(xCodeLine, FunctionName, FunctionType, FunctionParams, _$gXLocal) {

    DebugLines++;
    if (DebugLines < MaxDebugLines) {
        $("#DebugTable").append("\
					<tr style='background-color:#bbb'>\
						<td>" + xCodeLine + "</td>\
						<td>" + _$gXLocal + "</td>\
						<td>" + FunctionName + "</td>\
						<td>" + FunctionType + "</td>\
						<td>FUNCTION START</td>\
						<td>" + FunctionParams + "</td>\
						<td></td>\
					</tr>");

        var objDiv = document.getElementById("debug-div");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    //	$("#debug-div").append("<span title='"+ xCodeLine + ": Params: " + FunctionParams + "'>F "+FunctionName+" ("+FunctionType+") start " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$fe = function(xCodeLine, FunctionName, _$gXLocal) {
    DebugLines++;
    if (DebugLines < MaxDebugLines) {
        $("#DebugTable").append("\
					<tr style='background-color:#bbb'>\
						<td>" + xCodeLine + "</td>\
						<td>" + _$gXLocal + "</td>\
						<td>" + FunctionName + "</td>\
						<td></td>\
						<td>FUNCTION END</td>\
						<td></td>\
						<td></td>\
					</tr>");
        var objDiv = document.getElementById("debug-div");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    //	$("#debug-div").append("<span title='"+ xCodeLine + ":'>F "+FunctionName+" end " + _$gXLocal + "</span><br>");
}

//------------------------------------------------------------------------------
_$sb = function(xCodeLine, LeftSideStr, _$gXLocal) {
    DebugLines++;
    if (DebugLines < MaxDebugLines) {
        $("#DebugTable").append("\
					<tr style='background-color:#ccc'>\
						<td>" + xCodeLine + "</td>\
						<td>" + _$gXLocal + "</td>\
						<td>" + LeftSideStr + "</td>\
						<td></td>\
						<td>BEGIN SET VARIABLE</td>\
						<td></td>\
						<td></td>\
					</tr>");
        var objDiv = document.getElementById("debug-div");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    //	$("#debug-div").append(xCodeLine + ": begin set variable " + LeftSideStr+ "<br>");
    return 0;
}

//------------------------------------------------------------------------------
_$set = function(xCodeLine, NestedParent, ParentType, LeftSideStr, LeftSideValue, RightSideStr, RightSideValue, Operator, VarDeclerator, _$gXLocal, InnerFunctionCount) {

    if (InnerFunctionCount > 0) {
        for (var i = 0; i < (InnerFunctionCount); i++) {
            var TempVar = arguments[11 + i].split(/=(.+)?/);

            DebugLines++;
            if (DebugLines < MaxDebugLines) {
                $("#DebugTable").append("\
					<tr style='background-color:#aaa'>\
								<td>" + xCodeLine + "</td>\
								<td>" + _$gXLocal + "</td>\
								<td><span title='" + ESQ(TempVar[0]) + "'>" + TempVar[1] + "</span></td>\
								<td>" + _$v[parseInt(TempVar[0], 10)] + "</td>\
								<td>HELPER</td>\
								<td></td>\
								<td></td>\
							</tr>");
            }


            //			$("#debug-div").append("Helper:"+TempVar[0]+" -- " + TempVar[1] + "=" + _$v[parseInt(TempVar[0],10)] +" - " + _$gXLocal +  "<br>"  );
        }
    }
    var OutPut = null;

    if (Operator == '++') {
        OutPut = LeftSideValue + 1;
    } else
    if (Operator == '--') {
        OutPut = LeftSideValue - 1;
    } else
    if (Operator == '+=') {
        OutPut = LeftSideValue + RightSideValue;
    } else
    if (Operator == '-=') {
        OutPut = LeftSideValue - RightSideValue;
    } else {
        OutPut = RightSideValue;
    }
    var LS = "(" + LeftSideValue + ")";
    if (typeof LeftSideValue == "undefined") {
        var LS = "";
    }
    var VarDeclerator2 = "";
    if (VarDeclerator == "1") {
        VarDeclerator2 = "var ";
    }

    DebugLines++;
    if (DebugLines < MaxDebugLines) {
        $("#DebugTable").append("\
					<tr>\
						<td>" + xCodeLine + "</td>\
						<td>" + _$gXLocal + "</td>\
						<td><span title='" + ESQ(LS) + "'>" + VarDeclerator2 + LeftSideStr + "</span></td>\
						<td><span title='" + RightSideStr + "'>" + OutPut + "</span></td>\
						<td></td>\
						<td>" + NestedParent + " - " + ParentType + "</td>\
						<td>" + Operator + "</td>\
					</tr>");
        var objDiv = document.getElementById("debug-div");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    //	$("#debug-div").append("<span title='"+NestedParent + " - " + ParentType + " - " + RightSideStr + " Op:" + Operator + "'>"+ xCodeLine + ": " + VarDeclerator2+LeftSideStr+"="+JSON.stringify(OutPut)+" - " + _$gXLocal + "</span><br>");

    return OutPut;
}

//------------------------------------------------------------------------------
_$evl = function(xCodeLine, NestedParent, ParentType, StatemetStr, StatemetValue, _$gXLocal, InnerFunctionCount) {
    if (InnerFunctionCount > 0) {
        for (var i = 0; i < (InnerFunctionCount); i++) {
            var TempVar = arguments[7 + i].split(/=(.+)?/);

            DebugLines++;
            if (DebugLines < MaxDebugLines) {
                $("#DebugTable").append("\
					<tr style='background-color:#aaa'>\
								<td>" + xCodeLine + "</td>\
								<td>" + _$gXLocal + "</td>\
								<td><span title='" + ESQ(TempVar[0]) + "'>" + TempVar[1] + "</span></td>\
								<td>" + _$v[parseInt(TempVar[0], 10)] + "</td>\
								<td>HELPER</td>\
								<td></td>\
								<td></td>\
							</tr>");
            }

            //			$("#debug-div").append("Helper:"+TempVar[0]+" -- " + TempVar[1] + "=" + _$v[parseInt(TempVar[0],10)] +" - " + _$gXLocal + "<br>"  );
        }
    }

    OutPut = StatemetValue;
    //	$("#debug-div").append("<span title='"+ NestedParent + " - " + ParentType + "'>"+xCodeLine + ": "+StatemetStr+" ? "+OutPut+" - " + _$gXLocal + "</span><br>");

    DebugLines++;
    if (DebugLines < MaxDebugLines) {
        $("#DebugTable").append("\
					<tr>\
						<td>" + xCodeLine + "</td>\
						<td>" + _$gXLocal + "</td>\
						<td>" + StatemetStr + "</td>\
						<td>" + OutPut + "</span></td>\
						<td>EVALUATE</td>\
						<td>" + NestedParent + " - " + ParentType + "</td>\
						<td></td>\
					</tr>");
        var objDiv = document.getElementById("debug-div");
        objDiv.scrollTop = objDiv.scrollHeight;
    }


    return OutPut;
}

//------------------------------------------------------------------------------

$(document).ready(function() {
    _$gX++;
    var _$gXLocal = _$gX;
    _$fs(0, 'ready', 'FunctionExpression', '', _$gXLocal);

    function b5(b) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'b5', 'FunctionDeclaration', 'b', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [b5]', 'b', null, '', b, '=', '1', _$gXLocal, 0);

        function b55(b) {
            _$gX++;
            var _$gXLocal = _$gX;
            _$fs(0, 'b55', 'FunctionDeclaration', 'b', _$gXLocal);
            _$set(0, 'VariableDeclaration', 'Function [b55]', 'b', null, '', b, '=', '1', _$gXLocal, 0);
            return b + 2;
            _$fe(0, 'b55', _$gXLocal);
        }

        _$sb(10, 'bb', _$gXLocal);
        var bb = _$set(10, 'VariableDeclaration', '0', 'bb', bb, 'b55(b)*4', (_$v[1] = b55(b)) * 4, '=', '1', _$gXLocal, 1, '1=b55(b)');

        return b;
        _$fe(0, 'b5', _$gXLocal);
    }

    _$sb(15, 'cc', _$gXLocal);
    var cc = _$set(15, 'VariableDeclaration', '0', 'cc', cc, 'function() { return 1; }', function() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'cc', 'FunctionExpression', '', _$gXLocal);
        return 1;
        _$fe(0, 'cc', _$gXLocal);
    }, '=', '1', _$gXLocal, 0);
    _$sb(16, 'bb', _$gXLocal);
    var bb = _$set(16, 'VariableDeclaration', '0', 'bb', bb, 'function(a,b,c) { return a-b+c; }', function(a, b, c) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'bb', 'FunctionExpression', 'a,b,c', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [bb]', 'a', null, '', a, '=', '1', _$gXLocal, 0);
        _$set(0, 'VariableDeclaration', 'Function [bb]', 'b', null, '', b, '=', '1', _$gXLocal, 0);
        _$set(0, 'VariableDeclaration', 'Function [bb]', 'c', null, '', c, '=', '1', _$gXLocal, 0);
        return a - b + c;
        _$fe(0, 'bb', _$gXLocal);
    }, '=', '1', _$gXLocal, 0);

    function dd() {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'dd', 'FunctionDeclaration', '', _$gXLocal);
        return 2;
        _$fe(0, 'dd', _$gXLocal);
    }


    function a5(a) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'a5', 'FunctionDeclaration', 'a', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [a5]', 'a', null, '', a, '=', '1', _$gXLocal, 0);

        function a55(a) {
            _$gX++;
            var _$gXLocal = _$gX;
            _$fs(0, 'a55', 'FunctionDeclaration', 'a', _$gXLocal);
            _$set(0, 'VariableDeclaration', 'Function [a55]', 'a', null, '', a, '=', '1', _$gXLocal, 0);
            return a + 1;
            _$fe(0, 'a55', _$gXLocal);
        }

        _$sb(31, 'aa', _$gXLocal);
        var aa = _$set(31, 'VariableDeclaration', '0', 'aa', aa, 'a55(a)*2', (_$v[2] = a55(a)) * 2, '=', '1', _$gXLocal, 1, '2=a55(a)');

        if (_$evl(33, 'IfStatement', 'test', 'a<10', a < 10, _$gXLocal, 0)) {
            return aa + 10;
        } else
        if (_$evl(34, 'IfStatement', 'test', 'a>100', a > 100, _$gXLocal, 0)) {
            return a - 100;
        }

        return aa;
        _$fe(0, 'a5', _$gXLocal);
    }

    function a1(a) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'a1', 'FunctionDeclaration', 'a', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [a1]', 'a', null, '', a, '=', '1', _$gXLocal, 0);
        _$sb(41, 'aaa', _$gXLocal);
        var aaa = _$set(41, 'FunctionDeclaration > BlockStatement > VariableDeclaration', '0', 'aaa', aaa, 'a', a, '=', '1', _$gXLocal, 0);
        return aaa;
        _$fe(0, 'a1', _$gXLocal);
    }

    _$sb(45, 'blockC', _$gXLocal);
    var blockC = _$set(45, 'VariableDeclaration', '0', 'blockC', blockC, '[]', [], '=', '1', _$gXLocal, 0);
    blockC[1] = _$set(46, 'ExpressionStatement', 'expression', 'blockC[1]', blockC[1], '{}', {}, '=', '0', _$gXLocal, 0);
    blockC[1].X = _$set(47, 'ExpressionStatement', 'expression', 'blockC[1].X', blockC[1].X, '5', 5, '=', '0', _$gXLocal, 0);
    blockC[2] = _$set(48, 'ExpressionStatement', 'expression', 'blockC[2]', blockC[2], '5', 5, '=', '0', _$gXLocal, 0);

    _$sb(50, 'j', _$gXLocal);
    var j = _$set(50, 'VariableDeclaration', '0', 'j', j, '1', 1, '=', '1', _$gXLocal, 0);

    _$sb(52, 'i', _$gXLocal);
    var i = _$set(52, 'VariableDeclaration', '0', 'i', i, '$(window).width()+window.innerHeight+5+a5(5)+a5($(window).width())+a5(window.innerWidth)+blockC[2]+blockC[1].X+blockC[a1(2)]', (_$v[8] = $(window).width()) + window.innerHeight + 5 + (_$v[7] = a5(5)) + (_$v[6] = a5((_$v[5] = $(window).width()))) + (_$v[4] = a5(window.innerWidth)) + blockC[2] + blockC[1].X + blockC[(_$v[3] = a1(2))], '=', '1', _$gXLocal, 6, '3=a1(2)', '4=a5(window.innerWidth)', '5=$(window).width()', '6=a5($(window).width())', '7=a5(5)', '8=$(window).width()');
    if (_$evl(53, 'IfStatement', 'test', '(a1(i)>j) && (i>4) && a5(5)>20', ((_$v[10] = a1(i)) > j) && (i > 4) && (_$v[9] = a5(5)) > 20, _$gXLocal, 2, '9=a5(5)', '10=a1(i)')) {
        console.log(_$evl(53, 'BlockStatement > ExpressionStatement', '0', '5>6', 5 > 6, _$gXLocal, 0));
    }

    for (var k = _$set(55, 'ForStatement > VariableDeclaration', '0', 'k', k, '0', 0, '=', '1', _$gXLocal, 0); _$evl(55, 'ForStatement > VariableDeclaration', 'test', 'k<5', k < 5, _$gXLocal, 0); k = _$set(55, 'ForStatement > VariableDeclaration', 'update', 'k', k, 'k+1', k + 1, '=', '0', _$gXLocal, 0)) {
        i = _$set(57, 'BlockStatement > ExpressionStatement', 'expression', 'i', i, 'k+5', k + 5, '=', '0', _$gXLocal, 0);
        console.log(_$evl(58, 'ExpressionStatement', '0', 'k+\' ==== \'+a5(k)+i', k + ' ==== ' + (_$v[11] = a5(k)) + i, _$gXLocal, 1, '11=a5(k)'));
    }

    for (var k = _$set(61, 'ForStatement > VariableDeclaration', '0', 'k', k, '0', 0, '=', '1', _$gXLocal, 0); _$evl(61, 'ForStatement > VariableDeclaration', 'test', 'k<10', k < 10, _$gXLocal, 0);
        (tempVar = k, k = _$set(61, 'ForStatement > VariableDeclaration', 'update', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
        i = _$set(63, 'BlockStatement > ExpressionStatement', 'expression', 'i', i, 'k+5', k + 5, '=', '0', _$gXLocal, 0);
        console.log(_$evl(64, 'ExpressionStatement', '0', 'k+\' ==== \'+a5(k)-i', k + ' ==== ' + (_$v[12] = a5(k)) - i, _$gXLocal, 1, '12=a5(k)'));
    }

    _$sb(67, 'info', _$gXLocal);
    var info = _$set(67, 'VariableDeclaration', '0', 'info', info, '{}', {}, '=', '1', _$gXLocal, 0);
    info.name = _$set(68, 'ExpressionStatement', 'expression', 'info.name', info.name, '\'hi\'', 'hi', '=', '0', _$gXLocal, 0);


    _$sb(71, 'blockA', _$gXLocal);
    var blockA = _$set(71, 'VariableDeclaration', '0', 'blockA', blockA, '{firstName:\'John\', lastName:\'Doe\', age:50, eyeColor:\'blue\'}', {
        firstName: 'John',
        lastName: 'Doe',
        age: 50,
        eyeColor: 'blue'
    }, '=', '1', _$gXLocal, 0);
    _$sb(72, 'blockB', _$gXLocal);
    var blockB = _$set(72, 'VariableDeclaration', '0', 'blockB', blockB, '[\'hi 2\',\'hello 2\']', ['hi 2', 'hello 2'], '=', '1', _$gXLocal, 0);


    console.log(i);
    (tempVar = i, i = _$set(76, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '', 0, '++', 0, _$gXLocal, 0), tempVar);
    console.log(i);
    i = _$set(78, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '+=', '0', _$gXLocal, 0);
    console.log(i);
    i = _$set(80, 'ExpressionStatement > ExpressionStatement', 'expression', 'i', i, '1', 1, '-=', '0', _$gXLocal, 0);
    console.log(i);

    _$sb(83, 'block1', _$gXLocal);
    var block1 = _$set(83, 'ExpressionStatement > VariableDeclaration', '0', 'block1', block1, '{}', {}, '=', '1', _$gXLocal, 0);
    block1.name = _$set(84, 'ExpressionStatement', 'expression', 'block1.name', block1.name, '\'ONE\'', 'ONE', '=', '0', _$gXLocal, 0);
    block1.lname = _$set(85, 'ExpressionStatement', 'expression', 'block1.lname', block1.lname, '\'TWO\'', 'TWO', '=', '0', _$gXLocal, 0);

    _$sb(87, 'block2', _$gXLocal);
    var block2 = _$set(87, 'VariableDeclaration', '0', 'block2', block2, '[]', [], '=', '1', _$gXLocal, 0);
    block2[1] = _$set(88, 'ExpressionStatement', 'expression', 'block2[1]', block2[1], '\'THREE\'', 'THREE', '=', '0', _$gXLocal, 0);
    block2[2] = _$set(89, 'ExpressionStatement', 'expression', 'block2[2]', block2[2], '\'FOUR\'', 'FOUR', '=', '0', _$gXLocal, 0);
    block2[3] = _$set(90, 'ExpressionStatement', 'expression', 'block2[3]', block2[3], '\'FOUR-2\'', 'FOUR-2', '=', '0', _$gXLocal, 0);

    _$sb(92, 'block3', _$gXLocal);
    var block3 = _$set(92, 'VariableDeclaration', '0', 'block3', block3, '[]', [], '=', '1', _$gXLocal, 0);
    block3[1] = _$set(93, 'ExpressionStatement', 'expression', 'block3[1]', block3[1], '{}', {}, '=', '0', _$gXLocal, 0);
    block3[1].name = _$set(94, 'ExpressionStatement', 'expression', 'block3[1].name', block3[1].name, '\'FIVE\'', 'FIVE', '=', '0', _$gXLocal, 0);
    block3[1].lname = _$set(95, 'ExpressionStatement', 'expression', 'block3[1].lname', block3[1].lname, '\'SIX\'', 'SIX', '=', '0', _$gXLocal, 0);

    _$sb(97, 'f', _$gXLocal);
    var f = _$set(97, 'VariableDeclaration', '0', 'f', f, '(i>j) && (i>4)', (i > j) && (i > 4), '=', '1', _$gXLocal, 0);

    for (; _$evl(99, 'ForStatement', 'test', 'k<20', k < 20, _$gXLocal, 0);
        (tempVar = k, k = _$set(99, 'ForStatement', 'update', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar)) {
        console.log(k);
    }

    for (; _$evl(104, 'BlockStatement > ExpressionStatement > ForStatement', 'test', 'k<25', k < 25, _$gXLocal, 0);) {
        (tempVar = k, k = _$set(106, 'BlockStatement > ExpressionStatement', 'expression', 'k', k, '', 0, '++', 0, _$gXLocal, 0), tempVar);
        console.log(k);
    }

    console.log(_$evl(110, 'ExpressionStatement > ExpressionStatement', '0', 'block1.name+\' \'+block1.lname', block1.name + ' ' + block1.lname, _$gXLocal, 0));
    console.log(_$evl(111, 'ExpressionStatement', '0', 'block2[1]+\' \'+block2[2]+\' \'+block2[3]', block2[1] + ' ' + block2[2] + ' ' + block2[3], _$gXLocal, 0));
    console.log(_$evl(112, 'ExpressionStatement', '0', 'block3[1].name+\' \'+block3[1].lname', block3[1].name + ' ' + block3[1].lname, _$gXLocal, 0));

    // Get all the keys from document
    _$sb(115, 'keys', _$gXLocal);
    var keys = _$set(115, 'VariableDeclaration', '0', 'keys', keys, '$(\'#calculator span\')', (_$v[13] = $('#calculator span')), '=', '1', _$gXLocal, 1, '13=$(\'#calculator span\')');
    _$sb(116, 'operators', _$gXLocal);
    var operators = _$set(116, 'VariableDeclaration', '0', 'operators', operators, '[\'+\', \'-\', \'x\', \'/\']', ['+', '-', 'x', '/'], '=', '1', _$gXLocal, 0);
    _$sb(117, 'decimalAdded', _$gXLocal);
    var decimalAdded = _$set(117, 'VariableDeclaration', '0', 'decimalAdded', decimalAdded, 'false', false, '=', '1', _$gXLocal, 0);
    _$sb(118, 'InputStr', _$gXLocal);
    var InputStr = _$set(118, 'VariableDeclaration', '0', 'InputStr', InputStr, '""', "", '=', '1', _$gXLocal, 0);

    // Add onclick event to all the keys and perform operations
    $("#calculator span").click(function(e) {
        _$gX++;
        var _$gXLocal = _$gX;
        _$fs(0, 'click', 'FunctionExpression', 'e', _$gXLocal);
        _$set(0, 'VariableDeclaration', 'Function [click]', 'e', null, '', e, '=', '1', _$gXLocal, 0);
        // Get the input and button values
        _$sb(123, 'input', _$gXLocal);
        var input = _$set(123, 'ExpressionStatement > BlockStatement > VariableDeclaration', '0', 'input', input, '$(\'.screen\')', (_$v[14] = $('.screen')), '=', '1', _$gXLocal, 1, '14=$(\'.screen\')');
        _$sb(124, 'inputVal', _$gXLocal);
        var inputVal = _$set(124, 'VariableDeclaration', '0', 'inputVal', inputVal, 'input.html()', (_$v[15] = input.html()), '=', '1', _$gXLocal, 1, '15=input.html()');
        _$sb(125, 'btnVal', _$gXLocal);
        var btnVal = _$set(125, 'VariableDeclaration', '0', 'btnVal', btnVal, '$(this).html()', (_$v[16] = $(this).html()), '=', '1', _$gXLocal, 1, '16=$(this).html()');

        // Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
        // If clear key is pressed, erase everything
        if (_$evl(129, 'IfStatement', 'test', 'btnVal == \'C\'', btnVal == 'C', _$gXLocal, 0)) {
            InputStr = _$set(130, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, '""', "", '=', '0', _$gXLocal, 0);
            input.html(InputStr);
            decimalAdded = _$set(132, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        }

        // If eval key is pressed, calculate and display the result
        else if (_$evl(136, 'IfStatement', 'test', 'btnVal == \'=\'', btnVal == '=', _$gXLocal, 0)) {
            _$sb(137, 'equation', _$gXLocal);
            var equation = _$set(137, 'BlockStatement > VariableDeclaration', '0', 'equation', equation, 'inputVal', inputVal, '=', '1', _$gXLocal, 0);
            _$sb(138, 'lastChar', _$gXLocal);
            var lastChar = _$set(138, 'VariableDeclaration', '0', 'lastChar', lastChar, 'equation[equation.length - 1]', equation[equation.length - 1], '=', '1', _$gXLocal, 0);

            // Replace all instances of x with *.
            equation = _$set(141, 'ExpressionStatement', 'expression', 'equation', equation, 'equation.replace(/x/g, \'*\')', (_$v[17] = equation.replace(/x/g, '*')), '=', '0', _$gXLocal, 1, '17=equation.replace(/x/g, \'*\')');

            // Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
            if (_$evl(144, 'IfStatement', 'test', 'operators.indexOf(lastChar) > -1 || lastChar == \'.\'', (_$v[18] = operators.indexOf(lastChar)) > -1 || lastChar == '.', _$gXLocal, 1, '18=operators.indexOf(lastChar)')) {
                equation = _$set(145, 'BlockStatement > ExpressionStatement', 'expression', 'equation', equation, 'equation.replace(/.$/, \'\')', (_$v[19] = equation.replace(/.$/, '')), '=', '0', _$gXLocal, 1, '19=equation.replace(/.$/, \'\')');
            }

            if (equation) {
                input.html(eval(equation));
            }

            decimalAdded = _$set(150, 'IfStatement > BlockStatement > ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        } else if (_$evl(153, 'IfStatement', 'test', 'operators.indexOf(btnVal) > -1', (_$v[20] = operators.indexOf(btnVal)) > -1, _$gXLocal, 1, '20=operators.indexOf(btnVal)')) {
            // Operator is clicked
            // Get the last character from the equation
            _$sb(156, 'lastChar', _$gXLocal);
            var lastChar = _$set(156, 'BlockStatement > VariableDeclaration', '0', 'lastChar', lastChar, 'inputVal[inputVal.length - 1]', inputVal[inputVal.length - 1], '=', '1', _$gXLocal, 0);

            // Only add operator if input is not empty and there is no operator at the last
            if (_$evl(159, 'IfStatement', 'test', 'inputVal != \'\' && operators.indexOf(lastChar) == -1', inputVal != '' && (_$v[21] = operators.indexOf(lastChar)) == -1, _$gXLocal, 1, '21=operators.indexOf(lastChar)')) {
                InputStr = _$set(161, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
            }

            // Allow minus if the string is empty
            else if (_$evl(166, 'ExpressionStatement > IfStatement', 'test', 'inputVal == \'\' && btnVal == \'-\'', inputVal == '' && btnVal == '-', _$gXLocal, 0)) {
                InputStr = _$set(168, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
            }

            // Replace the last operator (if exists) with the newly pressed operator
            if (_$evl(173, 'ExpressionStatement > IfStatement', 'test', 'operators.indexOf(lastChar) > -1 && inputVal.length > 1', (_$v[22] = operators.indexOf(lastChar)) > -1 && inputVal.length > 1, _$gXLocal, 1, '22=operators.indexOf(lastChar)')) {
                // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
                InputStr = _$set(175, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'inputVal.replace(/.$/, btnVal)', (_$v[23] = inputVal.replace(/.$/, btnVal)), '=', '0', _$gXLocal, 1, '23=inputVal.replace(/.$/, btnVal)');
                input.html(InputStr);
            }

            decimalAdded = _$set(179, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'false', false, '=', '0', _$gXLocal, 0);
        }

        // Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
        else if (_$evl(183, 'IfStatement', 'test', 'btnVal == \'.\'', btnVal == '.', _$gXLocal, 0)) {
            if (!decimalAdded) {
                InputStr = _$set(185, 'BlockStatement > IfStatement > BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
                input.html(InputStr);
                decimalAdded = _$set(187, 'ExpressionStatement > ExpressionStatement', 'expression', 'decimalAdded', decimalAdded, 'true', true, '=', '0', _$gXLocal, 0);
            }
        }

        // if any other key is pressed, just append it
        else {
            InputStr = _$set(193, 'BlockStatement > ExpressionStatement', 'expression', 'InputStr', InputStr, 'btnVal', btnVal, '+=', '0', _$gXLocal, 0);
            input.html(InputStr);
        }

        // prevent page jumps
        e.preventDefault();
        _$fe(0, 'click', _$gXLocal);
    });




    /*
	//snake
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var d;
	var food;
	var score;
	
	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake
	
	function init()
	{
		d = "right"; //default direction
		create_snake();
		create_food(); //Now we can see the food particle
		//finally lets display the score
		score = 0;
		
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 500);
	}
	init();
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
	}
	
	//Lets create the food now
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw)
		}
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	
	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//restart game
			init();
			//Lets organize the code a bit now.
			return;
		}
		
		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.
		
		snake_array.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y);
		}
		
		//Lets paint the food
		paint_cell(food.x, food.y);
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		//The snake is now keyboard controllable
	})
	*/


    _$fe(0, 'ready', _$gXLocal);
});