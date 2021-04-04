export function getSaiban(input: string, option: number){
	// option 1(filename), 2(東京地+支+判)
	let bunkenshubetsu = input.match(/【文献種別】[ 　\t]*(?<keishiki>(?:判|決|中間判))[決定]／(?<court>.+[^方等])[方等]?裁判所(?:(?<shibu>.+支)部)?/);
	var shibuname = bunkenshubetsu.groups.shibu;
	var honbuname = bunkenshubetsu.groups.court;
	if (honbuname === '知的財産高'){var honbuname = '知財高';}
	let courtname = honbuname + '裁' ;
	let keishiki = bunkenshubetsu.groups.keishiki;
	if (option === 1){
	if (shibuname === undefined) {return courtname;}
	else {return courtname + shibuname + '部';}
}
else {
	if (shibuname === undefined) {return [honbuname ,'', keishiki];}
	else {return [honbuname, shibuname,  keishiki];}
}
}

export function getNengappi(input: string, option: number){
	// option 1(filename), 2(xx・xx・xx), 3(年月日)
	let nengappi = input.match(/【(裁判|判決|決定)年月日】[ 　\t]*(?<gengo>[^ 　\t]{2})[ 　\t]*(?<year>[0-9０-９元]{1,2})年[ 　\t]*(?<month>[0-9０-９]{1,2})月[ 　\t]*(?<day>[0-9０-９]{1,2})日/);
	let kanjiGengo = nengappi.groups.gengo;
	if (kanjiGengo === '令和'){var gengo = 'R';}
	else if (kanjiGengo === '平成'){var gengo = 'H';}
	else if (kanjiGengo === '昭和'){var gengo = 'S';}
	else if (kanjiGengo === '大正'){var gengo = 'T';}
	else {var gengo = 'M';}
	var year = nengappi.groups.year;
	let nen = toHankaku(year);
	if (nen === '元') {var yy = '01';}
	else if (nen.length === 1){var yy = '0' + nen;}
	else {var yy = nen;}
	var month = nengappi.groups.month;
	let getsu = toHankaku(month);
	if (getsu.length === 1){var mm = '0' + getsu;}
	else {var mm = getsu;}
	var day = nengappi.groups.day;
	let nichi = toHankaku(day);
	if (nichi.length === 1){var dd = '0' + nichi;}
	else {var dd = nichi;}
	let yymmdd = yy + mm + dd;
	if (option === 1){return gengo + yymmdd;}
	else if (option === 2){return kanjiGengo.substr(0,1) + nen + '・' + getsu  + '・' + nichi;}
	else if (option === 3){return kanjiGengo + nen + '年' + getsu  + '月' + nichi + '日';}
		
}

export function getCitation(input: string){
	let caseNum =  input.match(/【事件番号】[ 　\t]*(?<gengo>[^ 　\t]{2})[ 　\t]*(?<year>[0-9０-９元]{1,2})年[ 　\t]*(?<wa>[^第]+)第[ 　\t]*(?<num>[0-9０-９]+)号/);
	if (caseNum === null){return['no',''];}
	let caseNum2 = caseNum.groups.gengo + caseNum.groups.year + '年' + caseNum.groups.wa + caseNum.groups.num;
	let jikenBango = toHankaku(caseNum2);
	let keisai = input.match(/【掲載文献】[ 　\t]*((?:[^【]+\r?\n?)+)\r?\n(?:【|[ 　\t]*主[ 　]*文)/);
	if (keisai === null){return['',jikenBango];}
	else {
		if (keisai[1].includes('最高裁判所民事判例集')){
			var kangou = keisai[1].match(/最高裁判所民事判例集([0-9０-９]+巻[0-9０-９]+号[0-9０-９]+頁)/);
			return ['民集'+ toHankaku(kangou[1]), jikenBango];
		}
		else if (keisai[1].includes('判例時報')){
			var kangou = keisai[1].match(/判例時報([0-9０-９]+号[0-9０-９]+頁)/);
			return ['判時'+ toHankaku(kangou[1]), jikenBango];
		}
		else if (keisai[1].includes('判例タイムズ')){
			var kangou = keisai[1].match(/判例タイムズ([0-9０-９]+号[0-9０-９]+頁)/);
			return ['判タ'+ toHankaku(kangou[1]), jikenBango];
		}
		else {return ['',jikenBango];}
	}

}

export function seikei(input: string){
	let hankaku = toHankaku(input);
	let noKaigyou = hankaku.replace(/[\r\n]/g, '');
	let result = noKaigyou.replace(/[ 　\t]+/g, ' ');
	return result;
}

function toHankaku(input: string) {
	let result = input.replace(/[０-９Ａ-Ｚａ-ｚ（）]/g, function(s) {
	return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);});
	return result;}