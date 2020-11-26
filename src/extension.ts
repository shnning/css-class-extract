import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('css-class-extract.cssClassTract', () => {

		const document: string = vscode.window.activeTextEditor?.document.getText() || '';
		const classPicker: RegExp = /(class="(.+?)")|(class={(.+?)})/g;
		const cssClassNameAttrs: string[] = document.match(classPicker) || [];
		let cssText: string = '';

		if(!cssClassNameAttrs.length) {
			vscode.window.showInformationMessage('no css class here');
			return;
		}

		cssClassNameAttrs.forEach(cssClassNameAttr => {
			const matches = classPicker.exec(cssClassNameAttr)!;
			classPicker.lastIndex = 0;
			let isComplex: boolean = false;
			let temp: string = matches[2];

			if(matches[4]) {
				isComplex = true;
				temp = matches[4];
			}
			
			if(!isComplex) {
				temp.split(' ').forEach(className => {
					if(className) {
						cssText += '.' + className + ' {\n\n}\n\n';
					}
				});
			} else if(temp[0] === '[') {
				const _temp = temp.slice(1, -1);
				_temp.split(',').forEach(className => {
					className = className.trim();
					if(className) {
						if(className[0] === '\'' || className[0] === '\"') {
							className = className.slice(1, -1);
						}
						cssText += '.' + className + ' {\n\n}\n\n';
					}
				});
			} else if(temp[0] === '{') {
				const _temp = temp.slice(1, -1);
				_temp.split(',').forEach(className => {
					className = className.trim();
					if(className) {
						className = className.split(':')[0].trim();
						if(className[0] === '\'' || className[0] === '\"') {
							className = className.slice(1, -1);
						}
						cssText += '.' + className.split(':')[0].trim() + ' {\n\n}\n\n';
					}
				});
			}
		});
		vscode.env.clipboard.writeText(cssText).then(
			(msg) => {
				vscode.window.showInformationMessage('css classes has already cpoied into your clipboard~');
				console.log(msg);
			},
			(err) => {
				vscode.window.showInformationMessage('something wrong happend...');
				console.log(err);
			}
		);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
