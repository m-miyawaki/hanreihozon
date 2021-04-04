import {TextEncoder} from 'util';
import {getSaiban, getNengappi, getCitation, seikei} from './caseInfo';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('extension.hanreihozon', 
	 () => {
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let uri = editor.document.uri;
		let selection = editor.selection;
		if (selection.isEmpty){var jikenname = '';}
		else {var jikenname = seikei(document.getText(selection));} 
		let text = document.getText(); 
		var basename = getNengappi(text, 1) + getSaiban(text,1) + '[' + jikenname + ']' + '.txt';
		let workbenchConfig = vscode.workspace.getConfiguration('hanreihozon');
		let filepath = workbenchConfig.get('path');
		if (filepath !== '') {var basename = filepath + '\\' + basename; }
				
		vscode.window.showSaveDialog({
			defaultUri: vscode.Uri.file(basename)
			}).then((value) =>{
			const finalname = value;
			if (editor.document.isUntitled === true ){
				const content = new TextEncoder().encode(text);
				vscode.workspace.fs.writeFile(finalname, content).then(
					() =>{
						vscode.window.showInformationMessage('保存に成功しました。エディタで開きますか？','yes','no').then((value) => {
							if (value === 'yes'){
								vscode.workspace.openTextDocument(finalname).then((doc: vscode.TextDocument) => {
							vscode.window.showTextDocument(doc, 1, false).then(undefined, (error: any) => vscode.window.showErrorMessage(error)							);},(error: any) => vscode.window.showErrorMessage(error));
							}
						
					},(error: any) => vscode.window.showErrorMessage(error)
					);
				},(error: any) => vscode.window.showErrorMessage(error)
				);
			}
			else{vscode.workspace.fs.copy(uri, finalname).then(
			undefined, (error: any) => vscode.window.showErrorMessage(error)
			);}
		},(error: any) => vscode.window.showErrorMessage(error)
		);		

	//			let displayname = gengo + hizuke + ' ' + courtname + '[' + jikenname + ']\n';
	//			let position = new vscode.Position(0,0);
	//			editor.edit(edit => {
	//				edit.insert(position, displayname);
	//			});

	
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('extension.citationToClipboard', 
	 () => {
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let selection = editor.selection;
		if (selection.isEmpty){var jikenname = '';}
		else {var jikenname = seikei(document.getText(selection));} 
		let text = document.getText(); 
		let court = getSaiban(text,2);
		let workbenchConfig = vscode.workspace.getConfiguration('hanreihozon');
		if (workbenchConfig.get('citationToClipboard') === false) {var date = getNengappi(text, 2);}
		else {var date = getNengappi(text, 3);}
		let shutten = getCitation(text);
		if (court[0] === '最高'){var honbu = '最';}
		else {var honbu = court[0] + court[1];}
		let citation1 = honbu + court[2] + date;
		if (shutten[0] === 'no' ){var citation2 = citation1;}
		else if (shutten[0] === ''){var citation2 = citation1 + shutten[1] + '［' + jikenname　+ '］';}
		else {var citation2 = citation1 + shutten[0] + '［' + jikenname　+ '］';}

		vscode.env.clipboard.writeText(citation2);

		
	
	}));

}

export function deactivate() {}
